import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import {
  DEFAULT_SERVER_ADDRESS,
  WS_EVENTS,
} from '../../constants';
import { routes } from '../../router';
import { SocketContext } from '../../contexts/socket';
import type * as types from '../../types';
import './styles.css';

const Main = React.memo((): React.JSX.Element => {
  const navigate = useNavigate();

  const [address, setAddress] = useState<string>(DEFAULT_SERVER_ADDRESS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { connection, storeConnection } = useContext(SocketContext);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      setIsLoading(true);
      if (!(address && address.trim())) {
        return null;
      }

      if (storeConnection) {
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
          storeConnection(newConnection);
          setIsLoading(false);
          console.log('connected', newConnection.id);
          return navigate(routes.player);
        });
      }
    },
    [
      address,
      navigate,
      storeConnection,
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
          disabled={!(address && address.trim()) || isLoading}
          type="submit"
        >
          Connect
        </button>
      </form>
    </div>
  );
});

export default Main;
