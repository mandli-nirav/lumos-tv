import { useCallback, useState } from 'react';

import { PLAYER_SERVERS } from '@/config/playerServers';

/**
 * Hook for managing video player server state and transitions.
 * Handles server selection, error recovery, and failure tracking.
 *
 * @returns {Object} {
 *   selectedServer: Object,         // Currently selected server
 *   setSelectedServer: Function,    // Manually change server
 *   handleServerError: Function,    // Called on iframe error, auto-cycles to next
 *   allServersFailed: Boolean,      // True when all servers have failed
 *   isLoading: Boolean,             // True while waiting for stream
 *   setIsLoading: Function,
 *   resetError: Function,           // Reset error state and start over
 * }
 */
export const usePlayerServer = () => {
  const [selectedServer, setSelectedServerState] = useState(PLAYER_SERVERS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [allServersFailed, setAllServersFailed] = useState(false);

  // When user manually selects a server, reset error state
  const setSelectedServer = useCallback((server) => {
    setSelectedServerState(server);
    setIsLoading(true);
    setAllServersFailed(false);
  }, []);

  // When iframe fails to load, try next server
  const handleServerError = useCallback(() => {
    const currentIndex = PLAYER_SERVERS.findIndex(
      (s) => s.id === selectedServer.id
    );

    if (currentIndex < PLAYER_SERVERS.length - 1) {
      // Move to next server
      setIsLoading(true);
      setSelectedServerState(PLAYER_SERVERS[currentIndex + 1]);
    } else {
      // All servers exhausted
      setAllServersFailed(true);
    }
  }, [selectedServer]);

  // Reset error state to try again
  const resetError = useCallback(() => {
    setSelectedServerState(PLAYER_SERVERS[0]);
    setIsLoading(true);
    setAllServersFailed(false);
  }, []);

  return {
    selectedServer,
    setSelectedServer,
    handleServerError,
    allServersFailed,
    isLoading,
    setIsLoading,
    resetError,
  };
};
