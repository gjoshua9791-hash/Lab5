import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';

export default function Index() {
  const [screen, setScreen] = useState('dashboard');

  const initialStocks = [
    { id: 1, name: '$NFR', value: 130, change: 0 },
    { id: 2, name: '$PESO', value: 150, change: 0 },
    { id: 3, name: '$CATO', value: 80, change: 0 },
    { id: 4, name: '$PACO', value: 90, change: 0 },
    { id: 5, name: '$DPR', value: 75, change: 0 },
  ];

  const initialPumps = [
    { id: 1, value: 25, direction: 1, total: 0, active: true },
    { id: 2, value: 30, direction: -1, total: 0, active: true },
    { id: 3, value: 50, direction: 1, total: 0, active: true },
    { id: 4, value: 45, direction: -1, total: 0, active: true },
    { id: 5, value: 60, direction: 1, total: 0, active: true },
  ];

  const firstNames = ['Alex', 'Edgar', 'Joshua', 'Joseph', 'Adriana', 'Kaushiki', 'Donovan', 'Sylas', 'Brenda', 'Isaiah', 'Nebo'];
  const lastNames = [ 'Vartanian', 'Rosales', 'Garcia', 'Bentley', 'Villalta', 'Dubey', 'Mcgilbray', 'Sanchez', 'Murillo', 'Urquilla', 'Paul'];

  const [stocks, setStocks] = useState(initialStocks);
  const [pumps, setPumps] = useState(initialPumps);
  const [nameCount, setNameCount] = useState('10');
  const [generatedNames, setGeneratedNames] = useState([]);
  const [nameHistory, setNameHistory] = useState([]);
  const [stocksPaused, setStocksPaused] = useState(false);
  const [oilPaused, setOilPaused] = useState(false);

  useEffect(() => {
    if(stocksPaused) return;

    const interval = setInterval(() => {
      setStocks((prevStocks) => prevStocks.map((stock) => {
        const change = Math.floor(Math.random() * 21) - 10;
        let newValue = stock.value + change;
        if(newValue < 0) newValue =0;
        if(newValue > 200) newValue = 200;
        return { ...stock, value: newValue, change: change };
      }));
    }, 1000);
    return() => clearInterval(interval);
  }, [stocksPaused]);

  const sortedStocks = useMemo(() => {
    return [...stocks].sort((x, y) => y.value - x.value);
  }, [stocks]);
  const averageStockValue = stocks.reduce((sum, stock) => sum + stock.value, 0) / stocks.length;
  const topStock = sortedStocks[0];
  const totalPumped = pumps.reduce((sum, pump) => sum + pump.total, 0);
  const activePumpCount = pumps.filter((pump) => pump.active).length;

  const generateNames = () => {
    const maxNames = firstNames.length * lastNames.length;
    const requestedCount = Math.min(Math.max(parseInt(nameCount) || 0, 0), maxNames);
    const uniqueNames = new Set();

    while(uniqueNames.size < requestedCount) {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)];
      const last = lastNames[Math.floor(Math.random() * lastNames.length)];
      uniqueNames.add(`${first} ${last}`);

    }
    const newNames = Array.from(uniqueNames);
    setGeneratedNames(newNames);
    setNameHistory((prevHistory) => [newNames, ...prevHistory]);
  };

  useEffect(() => {
    if(oilPaused) return;

    const interval = setInterval(() => {
      setPumps((prevPumps) => prevPumps.map((pump) => {
        if(!pump.active) return pump;
        let newValue = pump.value + pump.direction * 5;
        let newDirection = pump.direction;
        if(newValue <= 0) {
          newValue = 0;
          newDirection = 1;
        }
        if(newValue >= 100) {
          newValue = 100;
          newDirection = -1;
        }
        return { ...pump, value: newValue, direction: newDirection, total: pump.total + newValue };
    })); }, 1000);
    return () => clearInterval(interval);
  }, [oilPaused]);

  const togglePump = (id) => {
    setPumps((prevPumps) => prevPumps.map((pump) => pump.id === id ? { ...pump, active: !pump.active} : pump));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lab 5</Text>
      
      <View style={styles.navRow}>
        <NavButton label="Dashboard" active={screen === 'dashboard'} onPress={() => setScreen('dashboard')} />
          <NavButton label="Stocks" active={screen === 'stocks'} onPress={() => setScreen('stocks')} />
            <NavButton label="Names" active={screen === 'names'} onPress={() => setScreen('names')} />
              <NavButton label="Oil" active={screen === 'oil'} onPress={() => setScreen('oil')} />
      </View>

      {screen === 'dashboard' && (<View style={styles.card}>
        <Text style={styles.sectionTitle}>Dashboard</Text>
        
        <Text style={styles.infoText}>Total Stocks: {stocks.length}</Text>
        <Text style={styles.infoText}>Average Stock Value: {averageStockValue.toFixed(2)}</Text>
        <Text style={styles.infoText}>Top Stock: {topStock.name} (${topStock.value.toFixed(2)})</Text>
        <Text style={styles.infoText}>Total Pumped: {totalPumped}</Text>
        <Text style={styles.infoText}>Active Pumps: {activePumpCount}</Text>
        <Text style={styles.infoText}>Generated Names: {generatedNames.length}</Text>
        <Text style={styles.infoText}>Name History: {nameHistory.length}</Text>
        
        
        </View>)}

          {screen === 'stocks' && (<View style={styles.card}>
        <Text style={styles.sectionTitle}>Stocks</Text>
        {sortedStocks.map((stock) => (
          <View key={stock.id} style={[styles.stockRow, topStock && stock.id === topStock.id ? styles.topStock : null]}>
            <View style={styles.stockHeader}>
              <Text style={styles.stockName}>{stock.name}</Text>
              <Text style={styles.stockValue}>${stock.value}</Text>
            </View>
            <Text style={[ styles.changeText, stock.change > 0 ? styles.positiveChange : stock.change < 0 ? styles.negativeChange : null]}>
            Change: {stock.change > 0 ? '+' : ''} {stock.change}</Text>

            <View styles={styles.barBackground}> 
              <View style={[styles.barFill, {width: `${(stock.value / 200) * 100}%`},

              ]}
              />
            </View>
          </View>
        ))}
        </View>)}

           {screen === 'names' && (<View style={styles.card}>
        <Text style={styles.sectionTitle}>Name Generator</Text>
        <Text styles={styles.label}>Number of Names to Generate:</Text>
        <TextInput style={styles.input} value={nameCount} onChangeText={setNameCount} keyboardType="numeric" placeholder="Enter a number" />
        <Pressable style={styles.generateButton} onPress={generateNames}>
          <Text style={styles.controlButtonText}>Generate Names</Text>
        </Pressable>
        <Text style={styles.subheading}>Generated Names:</Text>
        {generatedNames.length === 0 ? ( <Text style={styles.infoText}>No names generated yet.</Text> ) : (
          generatedNames.map((name, index) => (<Text key={`${name}-${index}`} style={styles.infoText}>{name}</Text>))
        )}

        <Text style={styles.subheading}>History of Generated Names:</Text>
        {nameHistory.length === 0 ? ( <Text style={styles.infoText}>No History Yet.</Text>) : (
          nameHistory.map((group, index) => (
            <View key={index} style={styles.historyBox}>
              <Text style={styles.historyTitle}>Generation {nameHistory.length - index}</Text>
              {group.map((name, innerIndex) => (
                <Text key={`${name}-${innerIndex}`} style={styles.infoText}>{name}</Text>
              ))}
            </View>
          ))
        )}

        </View>)}

          {screen === 'oil' && (<View style={styles.card}>
        <Text style={styles.sectionTitle}>Oil Pump Monitor</Text>
        
        {pumps.map((pump) => (
          <View key={pump.id} style={styles.pumpCard}>
            <Text style={styles.pumpTitle}>Pump {pump.id}</Text>
            <Text style={styles.infoText}>Current Value: {pump.value}</Text>
            <Text style={styles.infoText}>Direction: {pump.direction === 1 ? 'Increasing' : 'Decreasing'}</Text>
            <Text style={styles.infoText}>Total Pumped: {pump.total}</Text>
            <Text style={styles.infoText}>Status: {pump.active ? 'Active' : 'Inactive'}</Text>

            {pump.value >= 80 && <Text style={styles.highAlert}>High Value Alert!</Text>}
            {pump.value <= 20 && <Text style={styles.lowAlert}>Low Value Alert</Text>}

            <Pressable style={styles.toggleButton} onPress={() => togglePump(pump.id)}
            ><Text style={styles.controlButtonText}>{pump.active ? 'Turn Off Pump' : 'Turn On Pump'}</Text></Pressable>
            </View>
        ))}
        
        </View>)}

    </ScrollView>
  );
}

function NavButton({ label, active, onPress }) {
  return ( 
    <Pressable style={[styles.navButton, active ? styles.navButtonActive : null]}
    onPress={onPress}>
      <Text style={styles.navButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create ({
  container: {
    padding:20,
    paddingBottom:40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 8,
    color: '#000000',
  },
  navRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: '#42a7d2',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,

  },
  navButtonActive: {
    backgroundColor: '#2b85ae',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },

  },
  navButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },

  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4a7dc9',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#405473',
  },
  stockRow: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
  },
  topStock: {
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  stockName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeText: {
    fontSize: 14,
    marginBottom: 8,
  },
  positiveChange: {
    color: '#27ca66',
  },
  negativeChange: {
    color: '#ea3636',
  },
  barBackground: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    height: 18,
    overflow: 'hidden',
  },
  barFill: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    height: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#405473',
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  controlButtonText: {
    color: '#ffffff',
    fontWeight: '600',  },
  historyBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 10,   
    marginBottom: 12,
  },
  historyTitle: {
    fontWeight: '600',
    marginBottom: 6,
  },
  pumpCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  pumpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  highAlert: {
    color: '#ea3636',
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 6,  },
  lowAlert: {
    color: '#27ca66',
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 6, 
  },
  toggleButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },  
}
);