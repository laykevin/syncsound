export namespace Events {
  namespace ToServer {
    namespace System {
      enum Server {
        connection = 'connection',
      }
      enum Socket {
        disconnect = 'disconnect',
        disconnecting = 'disconnecting',
      }
      enum Adapter {
        createRoom = 'create-room',
        deleteRoom = 'delete-room',
        joinRoom = 'join-room',
        leaveRoom = 'leave-room',
      }
    }

    enum Chat {
      sendMessage = 'send-message',
    }

    enum Room {
      createOrJoinRoom = 'create-or-join-room',
    }
  }

  namespace ToClient {
    namespace System {
      enum Socket {
        connect = 'connect',
        disconnect = 'disconnect',
      }
    }

    enum Chat {
      receiveMessage = 'receive-message',
    }

    enum Room {
      createdRoom = 'created-room',
      joinedRoom = 'joined-room',
    }
  }
}

interface ServerToClientEvents {}

interface ClientToServerEvents {
  hello: () => void;
}
// List of reserved event names: https://socket.io/docs/v4/emit-cheatsheet/#reserved-events
