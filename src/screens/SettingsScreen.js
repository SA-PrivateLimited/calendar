import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Card, Text, List, Switch, Divider} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getTranslation} from '../utils/localization';

const SettingsScreen = () => {
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(false);

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem('language', lang);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Language / भाषा</Text>
          <Divider style={styles.divider} />
          
          <List.Item
            title="English"
            left={props => <List.Icon {...props} icon="translate" />}
            right={props => (
              <Switch
                value={language === 'en'}
                onValueChange={() => handleLanguageChange('en')}
              />
            )}
            onPress={() => handleLanguageChange('en')}
          />
          
          <List.Item
            title="हिंदी"
            left={props => <List.Icon {...props} icon="translate" />}
            right={props => (
              <Switch
                value={language === 'hi'}
                onValueChange={() => handleLanguageChange('hi')}
              />
            )}
            onPress={() => handleLanguageChange('hi')}
          />
          
          <List.Item
            title="संस्कृत"
            left={props => <List.Icon {...props} icon="translate" />}
            right={props => (
              <Switch
                value={language === 'sa'}
                onValueChange={() => handleLanguageChange('sa')}
              />
            )}
            onPress={() => handleLanguageChange('sa')}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Notifications</Text>
          <Divider style={styles.divider} />
          
          <List.Item
            title="Enable Notifications"
            description="Get reminders for festivals and notes"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => (
              <Switch
                value={notifications}
                onValueChange={setNotifications}
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>About</Text>
          <Divider style={styles.divider} />
          
          <Text style={styles.aboutText}>
            Hindu Panchang Calendar App
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          
          <Divider style={styles.divider} />
          
          <Text style={styles.brandingText}>
            Powered by SA-privateLimited.com
          </Text>
          <Text style={styles.contactText}>
            Contact: +91 8210900726
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  divider: {
    marginVertical: 8,
  },
  aboutText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  brandingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginTop: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default SettingsScreen;

