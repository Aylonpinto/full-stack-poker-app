import React, {useState , useEffect} from 'react'
import './App.css';
import api from './Api'
import TotalBalance from './components/TotalBalance';
import GameForm from './components/GameForm';
import _ from 'lodash';
import SettleBalanceModal from './components/SettleBalanceModal';



function App() {
  const [games, setGames] = useState([])
  const [gameName, setGameName] = useState('');
  const [playersData, setPlayersData] = useState([{name: '', start_balance: '', end_balance: ''}])
  const [balanceData, setBalanceData] = useState({})
  const [settleBalanceData, setSettleBalanceData] = useState([])


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
    const gameId = (games.length ? _.maxBy(games, g => g.id).id : 0) + 1  
    for (const player of playersData) {
      console.log(balanceData[player.name], player.name, balanceData)
      if (typeof balanceData[player.name] === 'undefined') {
        await api.post('/players/', {player_name: player.name, balance: 0});
      }
  
      // Fetch players and wait for the response before proceeding
      const playersResponse = await api.get('/players/');
      const playerId = _.find(playersResponse.data, p => {
        return p.player_name === player.name
      })?.id;
  
      const playerGameData = {
        game_id: gameId,
        player_id: playerId ?? 0,
        start_balance: player.start_balance,
        end_balance: typeof player.end_balance === 'number' ? player.end_balance : 0
      };  
      await api.post('/player_games/', playerGameData);
      
    }
    await api.post('/games/', {game_name: gameName});
  
    // Use the updatedGames array
    fetchGames();
    fetchBalanceData();
    setGameName('');
    setPlayersData([{name: '', start_balance: '', end_balance: ''}]);
  };

  const handleSettleBalance = async (event) => {
    event.preventDefault()
    const transactions = await api.get('/settle_balance/')
    setSettleBalanceData(transactions.data)
    deletePlayers()
  }
  
  const deletePlayers = async () => {
    const response = await api.get('/players/')
    const ids = response.data.map(p => p.id);
  
    for (const id of ids) {
      await api.delete(`/players/${id}`);
    }
    fetchBalanceData()
  }
  
  

  return (
    <div className="App">
      <header className="App-header">
      <h1>Poker Balance Tracker</h1>
      </header>
      <TotalBalance balanceData={balanceData} handleSettleBalance={handleSettleBalance}/>
      <h2>Create Poker Game</h2>
      <GameForm gameName={gameName} setGameName={setGameName} playersData={playersData} setPlayersData={setPlayersData} handleSubmit={handleFormSubmit}/>
      <SettleBalanceModal settleBalanceData={settleBalanceData}/>
    </div>  
  );
}

export default App;
