import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import {Card, Text, Chip, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {searchNotes} from '../services/api';
import {getLocalizedValue, getTranslation} from '../utils/localization';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState('all');
  const [language, setLanguage] = useState('en');

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const searchResults = await searchNotes(query, searchType);
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const renderResult = ({item}) => (
    <Card style={styles.resultCard}>
      <Card.Content>
        <Text style={styles.resultTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.resultDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View style={styles.resultFooter}>
          <Chip style={styles.categoryChip} textStyle={styles.chipText}>
            {item.category}
          </Chip>
          <Text style={styles.resultDate}>{item.date}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search festivals, notes, dates..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <Button
          mode="contained"
          onPress={handleSearch}
          style={styles.searchButton}>
          Search
        </Button>
      </View>

      {results.length === 0 && query ? (
        <View style={styles.emptyContainer}>
          <Icon name="magnify" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No results found</Text>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderResult}
          keyExtractor={item => item.id || item.date}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="magnify" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Enter a search query</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
  },
  searchButton: {
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
  },
  resultCard: {
    marginBottom: 12,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryChip: {
    backgroundColor: '#667eea',
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
  },
  resultDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 16,
  },
});

export default SearchScreen;

