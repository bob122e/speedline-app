import { Platform } from 'react-native';
var _   = require('lodash');
var sql = require('react-native-sqlite-storage');

var db = null
var stops = null;

module.exports.init = function(callback) {
  var opts = Platform.OS == "ios" ? {name: 'patco.sqlite', location: 'Documents'} :
                                    {name: 'main', createFromLocation : "patco.sqlite"}

  if (!db) {
    db = sql.openDatabase(opts, 
      function(result) {
        console.log(db.openargs.dblocation)
        console.log(result);
        db.transaction(function(tx) {
          console.log(tx);
          tx.executeSql("select * from stops", [], function(tx, data) {
            stops = _.sortBy(data.rows.raw(), ['stop_id'])
            stops = _.map(stops, x => ( {stop: x, latitude: x.stop_lat, longitude: x.stop_lon }))
            return callback(null, result);
          });
        });
      },
      (err) => callback(err)
      );
  } else {
    callback();
  }
}

module.exports.calendar = function(date, callback) {
  var day = this.daysOfWeek[date.weekday()];
  var dateString = date.format("YYYYMMDD");

  db.transaction(function(tx) {
    tx.executeSql("select * from calendar where " + day +  " = 1 and ? between start_date and end_date", [dateString], function(tx, data) {
      callback(null, data.rows.raw()[0]);
    });
  });
}

module.exports.stop_times = function(service_id, stop_id, time, callback) {
  db.transaction(function(tx) {
    var sql = `
      select t.service_id, t.route_id, t.trip_headsign, t.trip_id, st.departure_time
      from trips t
      join stop_times st
        on t.trip_id = st.trip_id

      where t.service_id = ?
        and stop_id = ?
        and departure_time >= ?

      order by st.departure_time

      limit 10  
    `;

    tx.executeSql(sql, [service_id, stop_id, time], function(tx, data) {
      callback(null, data.rows.raw());
    })

  })
}

module.exports.stops = function() {
  return stops;
}

module.exports.daysOfWeek = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
  7: "sunday"
}