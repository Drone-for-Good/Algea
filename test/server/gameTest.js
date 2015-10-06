var chai = require('chai');
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var game = require('../../server/game.js');
var db = require('../../DB/models.js');
var dbhelpers = require('../../server/db-helpers.js');

/* GAME.JS : */

describe('Modifying rooms in the game', function () {
  it('Game should have an array of roomnames', function () {
    expect(game.roomNames).to.be.instanceOf(Array);
  });

  it('addRoom should add into roomData\'s rooms object', function () {
    var fakeRoom = {
      roomName: "TestRoom",
      playerCount: 0,
      maxPlayerCount: 10,
      playerInfo: {
        username: "TestUser",
        positionAndRadius: [{
          x: 0,
          y: 0,
          radius: 50
        }];
        skins: "fakeSkin"
      }
    };

    game.addRoom(fakeRoom);
    expect(game.roomData.rooms).to.have.property(fakeRoom.roomName);

  });

  it('allRooms should have give objects with the name, max, and count',
    function () {
      var allRoomsResult = game.allRooms();
      expect(allRoomsResult[0]).to.have.property('roomName');
      expect(allRoomsResult[0]).to.have.property('maxCount');
      expect(allRoomsResult[0]).to.have.property('count');
  });
});

/* DB-HELPERS.JS : */

describe('Server passes information to the database', function () {

  //made up these numbers to test the database
  var userId = 14623;
  var fakeUserStats = {
    lifetime: 100000,
    score: 700,
    mass: 162,
    totalKills: 14,
    totalFood: 100,
    timeInFirst: 0
  };

  //addGameStats

  //updateBestStats
  it ('updateBestStats should add to GameStats table', function () {
    dbhelpers.updateBestStats(fakeUserStats);
    var findInTable = db.BestStats.find({where: {userid: userId}});
    expect(findInTable).to.be.instanceOf(Object);
  });

  //updateTotalStats

});
