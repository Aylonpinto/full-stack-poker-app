import logo from './logo.svg';
import React, {useState , useEffect} from 'react'
import './App.css';
import api from './Api'
import PokerForm from './components/PokerForm';
import { Container } from '@mui/material';
import { Button } from '@mui/joy';
import TotalBalance from './components/TotalBalance';
import GameForm from './components/GameForm';
import _ from 'lodash';



function App() {
  const [games, setGames] = useState([])
  const [gameName, setGameName] = useState('');
  const [playersData, setPlayersData] = useState([{name: '', start_balance: '', end_balance: ''}])
  const [balanceData, setBalanceData] = useState({})


  const fetchGames = async () => {
    const response = await api.get('/games/')
    setGames(response.data ?? [])
  }

  const fetchBalanceData = async () => {
    const response = await api.get('/players/')
    const data = {}
    for (const player of response.data) {
      data[player.player_name] = player.balance
    }
    setBalanceData(data)
  }

  useEffect(() => {
    fetchGames()
    fetchBalanceData()
  }, [])



  // const handleFormSubmit = async (event) => {
  //   event.preventDefault();
  //   await api.post('/games/', {game_name: gameName})
    
  //   const gameId = _.find(games, g => g.game_name === gameName)
  //   for (const player of playersData) {
  //     if (!balanceData[player.name]) {
  //       await api.post('/players/', {player_name: player.name, balance: 0})
  //     }
  //     const players = await api.get('/players/')
  //     const playerId = _.find(players, p => p.name === player.name).id
  //     const playerGameData = {
  //       game_id: gameId,
  //       player_id: playerId,
  //       start_balance: player.start_balance,
  //       end_balance: player.end_balance
  //     }
  //     await api.post('/player_games/', playerGameData)
  //   }
  //   fetchGames()
  //   fetchBalanceData()
  //   setGameName('')
  //   setPlayersData([{name: '', start_balance: '', end_balance: ''}])
  // }

  const handleDeleteGames = async (event) => {
    event.preventDefault();
    const ids = games.map(g => g.id);
  
    for (const id of ids) {
      await api.delete(`/games/${id}`);
    }
  
    fetchGames();
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    // Fetch games and wait for the response before proceeding
    const gamesResponse = await api.post('/games/', {game_name: gameName});
    const gameId = gamesResponse.data.id;
  
    // Fetch games again after creating a new game
    const updatedGamesResponse = await api.get('/games/');
    const updatedGames = updatedGamesResponse.data;
  
    for (const player of playersData) {
      if (!balanceData[player.name]) {
        await api.post('/players/', {player_name: player.name, balance: 0});
      }
  
      // Fetch players and wait for the response before proceeding
      const playersResponse = await api.get('/players/');
      console.log(playersResponse.data)
      const playerId = _.find(playersResponse.data, p => {
        return p.player_name === player.name
      })?.id;
      console.log(playerId)
  
      const playerGameData = {
        game_id: gameId,
        player_id: playerId ?? 0,
        start_balance: player.start_balance,
        end_balance: player.end_balance
      };
  
      await api.post('/player_games/', playerGameData);
    }
  
    // Use the updatedGames array
    setGames(updatedGames);
    fetchBalanceData();
    setGameName('');
    setPlayersData([{name: '', start_balance: '', end_balance: ''}]);
  };
  
  
  

  return (
    <div className="App">
      <header className="App-header">
      <h1>Poker Balance Tracker</h1>
      </header>
      <TotalBalance balanceData={balanceData}/>
      <h2>Create Poker Game</h2>
      <GameForm gameName={gameName} setGameName={setGameName} playersData={playersData} setPlayersData={setPlayersData} handleSubmit={handleFormSubmit}/>
      <Button onClick={handleDeleteGames}>
        Delete games
      </Button>
    </div>  
  );
}

export default App;
