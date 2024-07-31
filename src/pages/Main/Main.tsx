import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
// import { useNavigate } from 'react-router-dom';
import { io, type Socket } from 'socket.io-client';

// import { routes } from '../../router';
import type * as types from '../../types';
import { WS_EVENTS } from '../../constants';
import './styles.css';

const Main = React.memo((): React.JSX.Element => {
  // const navigate = useNavigate();

  const [address, setAddress] = useState<string>('http://localhost:5077');
  const [connection, setConnection] = useState<Socket | null>(null);

  const handleSubmit = useCallback(
    () => {
      if (!(address && address.trim())) {
        return null;
      }

      const newConnection = io(
        address,
        {
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1,
          reconnectionDelayMax: 10,
          retries: 10,
        },
      );

      newConnection.on('connect', () => {
        setConnection(newConnection);
        console.log('connected', newConnection.id);
      });

      console.log('submit', address);
      // return navigate(routes.player);
    },
    [
      address,
      // navigate,
    ],
  );

  const addTrack = (payload: types.Track) => {
    console.log(payload);
  };

  const loadPlaylist = (payload: types.Track[]) => {
    console.log(payload);
  };


  useEffect(
    () => {
      if (connection) {
        connection.on(WS_EVENTS.addTrack, addTrack);
        connection.on(WS_EVENTS.loadPlaylist, loadPlaylist);
      }
      return () => {
        if (connection) {
          connection.off(WS_EVENTS.addTrack, addTrack);
          connection.off(WS_EVENTS.loadPlaylist, loadPlaylist);
        }
      };
    },
    [connection],
  );

  return (
    <div>
      <h2>
        VAWE Remote
      </h2>
      <form
        className="f d-col mt-1 form"
        onSubmit={handleSubmit}
      >
        <input
          className="input mt-1"
          onChange={(event) => setAddress(event.currentTarget.value)}
          placeholder="http://localhost:5077"
          type="text"
          value={address}
        />
        <button
          className="button mt-1"
          disabled={!(address && address.trim())}
          type="submit"
        >
          Connect
        </button>
      </form>
    </div>
  );
});

export default Main;
