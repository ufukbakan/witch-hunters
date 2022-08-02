var assert = require('assert');
const { after } = require('mocha');
const rewire = require('rewire');
const server = require('..');
const { Room } = require('../src/rooms');
const RoomService = rewire('../src/rooms');
const generateRoomId = RoomService.__get__("generateRoomId");
const rooms = RoomService.__get__("rooms");
const checkCollision = RoomService.__get__("checkCollision");



describe('Rooms Service', function () {

    after(()=>{
        server.shutdown();
    });

    it("Should generate 4 length id", ()=>{
        assert.equal(
            generateRoomId().length, 4
        )
    });

    it("Should return true when there is an room with same id", ()=>{
        rooms.push(new Room("1234"));
        assert.equal(
            checkCollision("1234"), true
        );
        assert.equal(
            checkCollision("123"), false
        );
    });

    it.skip("Should clear inactive rooms only", ()=>{
        rooms.push(new Room("ABC1"));
        activeRoomIds.add("ABC1");
        clearRooms();
        assert(rooms.length, 1);
        activeRoomIds.clear();
        clearRooms();
        assert(rooms.length, 0);
    });

});

describe.skip("Data examples", ()=>{
    it("Generated ids:", ()=>{
        for(let i = 0; i < 42840; i++){
            const generated = generateRoomId();
            if(generated.length > 4){
                console.log("Generated 5 length "+ generated+" at "+i+"th step");
            }
        }
    })
})