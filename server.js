// const express = require('express');
// const {createServer} = require('node:https');
// const https = require("https");
const http = require("http");
const { Server } = require('socket.io');
const fs = require('fs'); // Import file system module
const mysql = require("mysql");
const mysql2 = require("mysql2");
const port = process.env.PORT || 4000;

const httpsServer = http.createServer({
  key: fs.readFileSync("./cert/cert.key"),
  cert: fs.readFileSync("./cert/cert.crt"),
  ca: fs.readFileSync("./cert/yourca.crt", { optional: true }),  // Optional for self-signed certificates
  requestCert: false,
    rejectUnauthorized: false
});
const corsOptions = {
  origin: "http://127.0.0.1:8000",
  credentials: true, 
  methods: ["GET", "POST"]
};
const io = new Server(httpsServer,{
  cors: corsOptions}
  );

var crashPosition = 1.00;
var finalcrash = 0;
var fly;
var betamount = 0;
var clients = [];
var period;
var nextcrash = 0;
var periodTime;
var newPeriodStartTime = 20;

var connection = mysql.createPool({
  connectionLimit: 2,
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "saurabh",
  database: "yuviwin_game",
  // connectionLimit: 2,
  // host: "127.0.0.1",
  // user: "sql_yuviwin_thix",
  // password: "jXKLxzDYhMDWMD57",
  // database: "sql_yuviwin_thix",
});

console.log('connection successfully', connection);

function setcrash() {
  const nxtQuery = "SELECT * FROM aviset WHERE id = 1";
  connection.query(nxtQuery, (err, nxtResult) => {
    if (!err) {
      period = parseInt(nxtResult[0].period);
      nextcrash = nxtResult[0].nxt;
      console.log("period.........", period, "next...............", nextcrash);
      periodTime = Date.now();
      console.log("start time .......", periodTime);
      if (nextcrash != 0) {
        finalcrash = nextcrash;
        console.log(finalcrash);
        repeatupdate(200);
      } else {
        const query9 = `SELECT SUM(amount) AS total FROM crashbetrecord WHERE period='${period}' AND status ='pending'`;
        connection.query(query9, (err, result) => {
          if (err) {
            console.error("Error fatch record from db:", err);
          } else {
            if (result[0].total == null) {
              betamount = 0;
            } else {
              betamount = result[0].total;
            }
            if (betamount == 0) {
                finalcrash = Math.floor((Math.random() * 200).toFixed(2) + 10);
                // finalcrash = 1;
            } else {
              if (betamount < 50) {
                finalcrash = (Math.random() * 9).toFixed(2); //10
              } else if (betamount >= 50 && betamount < 100) {
                finalcrash = (Math.random() * 2.5).toFixed(2); //3
              } else if (betamount >= 100 && betamount < 150) {
                finalcrash = (Math.random() * 8).toFixed(2); //8.5
              } else if (betamount >= 150 && betamount < 200) {
                finalcrash = (Math.random() * 7.5).toFixed(2); //8
              } else if (betamount >= 200 && betamount < 250) {
                finalcrash = (Math.random() * 7).toFixed(2); //7.5
              } else if (betamount >= 250 && betamount < 300) {
                finalcrash = (Math.random() * 3.5).toFixed(2); //4
              } else if (betamount >= 300 && betamount < 350) {
                finalcrash = (Math.random() * 5.5).toFixed(2); //6
              } else if (betamount >= 350 && betamount < 400) {
                finalcrash = (Math.random() * 4.5).toFixed(2); //5
              } else if (betamount >= 400 && betamount < 450) {
                finalcrash = (Math.random() * 3.5).toFixed(2); //4?
              } else if (betamount >= 450 && betamount < 500) {
                finalcrash = (Math.random() * 3.8).toFixed(2); //4
              } else if (betamount >= 500 && betamount < 550) {
                finalcrash = (Math.random() * 1.5).toFixed(2); //2
              } else if (betamount >= 550 && betamount < 600) {
                finalcrash = (Math.random() * 2.5).toFixed(2); //3
              } else if (betamount >= 600 && betamount < 650) {
                finalcrash = (Math.random() * 2).toFixed(2); //2.5
              } else if (betamount >= 650 && betamount < 700) {
                finalcrash = (Math.random() * 6.8).toFixed(2); //7
              } else if (betamount >= 700 && betamount < 750) {
                finalcrash = (Math.random() * 1.8).toFixed(2); //2
              } else if (betamount >= 750 && betamount < 800) {
                finalcrash = (Math.random() * 9).toFixed(2); //9.7
              } else if (betamount >= 800 && betamount < 850) {
                finalcrash = (Math.random() * 2.5).toFixed(2); //3
              } else if (betamount >= 850 && betamount < 900) {
                finalcrash = (Math.random() * 1.9).toFixed(2); //2
              } else if (betamount >= 900 && betamount < 950) {
                finalcrash = (Math.random() * 5.6).toFixed(2); //6
              } else if (betamount >= 950 && betamount < 1000) {
                finalcrash = (Math.random() * 2.8).toFixed(2); //3
              } else if (betamount >= 1000 && betamount < 1300) {
                finalcrash = (Math.random() * 4.8).toFixed(2); //5
              } else if (betamount >= 1300 && betamount < 1600) {
                finalcrash = (Math.random() * 2.6).toFixed(2); //3
              } else if (betamount >= 1600 && betamount < 1900) {
                finalcrash = (Math.random() * 3.8).toFixed(2); //4
              } else {
                finalcrash = (Math.random() * 1.5).toFixed(2); //2
              }
            }
                           // finalcrash = 3;//Math.floor((Math.random() * 490).toFixed(2) + 10);
            console.log(
              "crahpoint.......",
              finalcrash,
              "total Amount............",
              betamount
            );
            repeatupdate(200);
          }
        });
      }
    }
  });
}
function restartplane() {
  clearInterval(fly);
  console.log("reset............");
  var nextperiod = period + 1;
  const updateNxtQuery = `UPDATE aviset SET nxt = 0,period = '${nextperiod}' WHERE id = 1`;
  connection.query(updateNxtQuery, (err) => {
    if (err) {
      console.error("Error updating nxt in aviset table:", err);
    } else {
      console.log("crash point by admin clear");
    }
  });
  console.log("period.........", period, "crashed.........", crashPosition);
  const query5 = `INSERT INTO crashgamerecord (crashpoint, period) VALUES ('${crashPosition}', '${period}') ON DUPLICATE KEY UPDATE crashpoint = VALUES(crashpoint)`;
  connection.query(query5, (err, result) => {
    if (err) {
      console.error("Error adding record to database:", err);
    }
  });
  io.emit("updatehistory", { crashPosition, period });
  setTimeout(() => {
    const query4 = `UPDATE crashbetrecord SET status = 'fail',winpoint='${crashPosition}' WHERE period='${period}' AND status = 'pending'`;
    connection.query(query4, (err, result) => {
      if (err) {
        console.error("Error adding record to database:", err);
      } else {
        console.log("result declared");
        period = nextperiod;
      }
    });
    io.volatile.emit("reset", period);
  }, 200);

setTimeout(() => {
    const nxtQuery = "SELECT * FROM aviset WHERE id = 1";
    connection.query(nxtQuery, (err, nxtResult) => {
      if (!err) {
        period = parseInt(nxtResult[0].period);
        io.emit("removecrash", period);
        fly = setInterval(()=>{
            var time = newPeriodStartTime;
            console.log("time",time);
            io.emit("prepareplane", {period,time});
            newPeriodStartTime -= 1;
            if(newPeriodStartTime == 0){
                clearInterval(fly);
                crashPosition = 1.00;
                newPeriodStartTime = 20;
                io.emit("flyplane", period);
                setcrash();
            }
        },1000)
      }
    });
  }, 1000);
    
}
function updateCrashInfo() {
  var fc = parseFloat(finalcrash);
  var cp = parseFloat(crashPosition);
//   io.on("instantCrash",function (username, crashpoint) {
//         crashPosition = parseFloat(crashpoint)
//      if(username == 'BombwinAdmin@#123456'){
//       }
//     }); 
   var cPosition = parseFloat(crashPosition);
    const selectQuery = `SELECT * FROM crashbetrecord  WHERE auto > 0 AND auto <=${cPosition} AND period='${period}' AND status="pending"`;
    connection.query(selectQuery, (err, result) => {
      if (err) {
        console.error("Error selecting records:", selectErr);
      } else {
        result.forEach((result) => {
            var winamount = parseFloat(result.amount * result.auto);
            winamount = winamount.toFixed(2);
          const updateQuery = `UPDATE users SET balance = balance + ${winamount} WHERE username='${result.username}' `;
          var user = result.username;
          var wp = parseFloat(result.auto).toFixed(2);
          connection.query(updateQuery, (err, result) => {
            if (err) {
                console.log("error");
            }
          });
          const updateQuery2 = `UPDATE crashbetrecord SET status = 'success', winpoint = ${wp} WHERE id=${result.id} `;
          connection.query(updateQuery2, (err, result) => {
            if (err) {
                console.log("error");
            }
          });
          const qry = `select usercode from users where username = '${user}'`;
          connection.query(qry, (err, result) => {
            if (!err) {
              io.emit("betout", result[0].usercode);
            }
          });
        });
      }
    });
  if (fc > cp) {
    // auto bet out setting and code ??
    // var data = (Math.random() * 0.1).toFixed(2);
    if(crashPosition >= 13){
        crashPosition = (cPosition + (Math.random() * 0.5)).toFixed(2);
    }
    else if(crashPosition < 4){
    crashPosition = (cPosition + 0.01).toFixed(2);
    }else{
    crashPosition = (cPosition + (Math.random() * 0.1)).toFixed(2);
    }
    io.emit("crash-update", { crashPosition, period, periodTime });
  } else {
    restartplane();
  }
}

// Function to repeatedly update crash data
function repeatupdate(duration) {
  fly = setInterval(updateCrashInfo, duration);
}

io.on("connection", (socket) => {
  console.log("A user connected");
  clients.push(socket.id);
  socket.emit("working", "ACTIVE...!");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("newBet", function (period, username, amount, auto) {
    console.log('newBet event received', { period, username, amount, auto });
    if (auto === undefined || auto === null) {
      auto = null;
    }
    const bal = `SELECT * From users  WHERE username = '${username}'`;
    connection.query(bal, (err, result) => {
      if (err) {
        console.error("Error adding record to database:", err);
      } else {
        if (result[0].balance > amount) {
          const query1 = `UPDATE users SET balance = balance - ${amount} WHERE username = '${username}'`;
          connection.query(query1, (err, result) => {
            if (err) {
              console.error("Error adding record to database:", err);
            }
          });
          betamount = ((amount * 98)/100).toFixed(2); // bet fee

          var ref1 = result[0].refcode;
          var ref2 = result[0].refcode1;
          var ref3 = result[0].refcode2;
          if (ref1 != null) {
            const bonus = (amount * 2/100  * 0.4).toFixed(2);
            const qref = `UPDATE users SET bonus = bonus + ${bonus} WHERE usercode = '${ref1}'`;
            const bonq = `INSERT INTO bonus (giver, usercode, amount, level)
            VALUES ('${username}', '${ref1}', '${bonus}', '1')`;
            connection.query(qref, (err, result) => {
              if (!err) {
                connection.query(bonq, (err, result) => {
                  if (err) {
                    console.log("error on add bonus record", err);
                  }
                });
              } else {
                console.log("error on add bonus update for referal", err);
              }
            });
            if (ref2 != null) {
              const bonus = (amount * 2/100  * 0.2).toFixed(2);
              const qref = `UPDATE users SET bonus = bonus + ${bonus} WHERE usercode = '${ref2}'`;
              const bonq = `INSERT INTO bonus (giver, usercode, amount, level)
            VALUES ('${username}', '${ref1}', '${bonus}', '2')`;
              connection.query(qref, (err, result) => {
                if (!err) {
                  connection.query(bonq, (err, result) => {
                    if (err) {
                      console.log("error on add bonus record", err);
                    }
                  });
                } else {
                  console.log("error on add bonus update for referal", err);
                }
              });
              if (ref3 != null) {
                const bonus = (amount * 2/100 * 0.1).toFixed(2);
                const qref = `UPDATE users SET bonus = bonus + ${bonus} WHERE usercode = '${ref3}'`;
                const bonq = `INSERT INTO bonus (giver, usercode, amount, level)
              VALUES ('${username}', '${ref1}', '${bonus}', '3')`;
                connection.query(qref, (err, result) => {
                  if (!err) {
                    connection.query(bonq, (err, result) => {
                      if (err) {
                        console.log("error on add bonus record", err);
                      }
                    });
                  } else {
                    console.log("error on add bonus update for referal", err);
                  }
                });
              }
            }
          }
          const query = `INSERT INTO crashbetrecord (period,username, amount,auto) VALUES ('${period}','${username}', ${betamount},${auto})`;
          connection.query(query, (err, result) => {
            if (err) {
              console.error("Error adding record to database:", err);
            }
          });
        }
      }
    });
  });
  socket.on("addWin", function (username, amount, winpoint) {
    console.log('addWin event received', { username, amount, winpoint });
    console.log("period ",period);
    const bets = `SELECT SUM(amount) AS bets FROM crashbetrecord WHERE status ='pending' AND period='${period}' AND username = '${username}'`;
    connection.query(bets, (err, result) => {
      if (err) {
        console.error("Error adding record to database:", err);
      } else {
        if (result[0].bets > 0) {
          console.log("winner");
          var winamount = parseFloat(amount * winpoint);
          winamount = winamount.toFixed(2);
          console.log(winamount);
          const query2 = `UPDATE users SET balance = balance + ${winamount} WHERE username = '${username}'`;
          connection.query(query2, (err, result) => {
            if (err) {
              console.error("Error adding record to database:", err);
            }
          });
          const query3 = `UPDATE crashbetrecord SET status = 'success', winpoint='${winpoint}' WHERE username = '${username}'AND period='${period}'  AND status = 'pending'`;

          connection.query(query3, (err, result) => {
            if (err) {
              console.error("Error adding record to database:", err);
            } else {
              const qry = `select usercode from users where username = '${username}'`;
              connection.query(qry, (err, result) => {
                if (!err) {
                  socket.emit("betout", result[0].usercode);
                }
              });
            }
          });
        }
      }
    });
  });
});
setcrash();
httpsServer.listen(port, () => {
  console.log(`Server running at :${port}/`);

});
