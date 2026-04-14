import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';

export default function Index() {
  const [screen, setScreen] = useState('dashboard');

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
        <Text style={styles.sectionTitle}>Dashboard</Text></View>)}

          {screen === 'stocks' && (<View style={styles.card}>
        <Text style={styles.sectionTitle}>Stocks</Text></View>)}

           {screen === 'names' && (<View style={styles.card}>
        <Text style={styles.sectionTitle}>Name Generator</Text></View>)}

          {screen === 'oil' && (<View style={styles.card}>
        <Text style={styles.sectionTitle}>Oil Pump Monitor</Text></View>)}

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
  }
);