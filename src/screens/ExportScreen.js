import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {Card, Button, Text, Divider} from 'react-native-paper';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import {exportCalendar} from '../services/api';
import {getTranslation} from '../utils/localization';

const ExportScreen = () => {
  const [exporting, setExporting] = useState(false);
  const [year, setYear] = useState(2026);
  const [language, setLanguage] = useState('en');

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const data = await exportCalendar(format, year);
      
      if (format === 'json') {
        const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        await shareData(jsonString, `calendar-${year}.json`, 'application/json');
      } else if (format === 'csv') {
        await shareData(data, `calendar-${year}.csv`, 'text/csv');
      } else if (format === 'pdf') {
        // For PDF, save to file system first
        const filePath = `${RNFS.DocumentDirectoryPath}/calendar-${year}.pdf`;
        await RNFS.writeFile(filePath, data, 'base64');
        await Share.open({
          url: `file://${filePath}`,
          type: 'application/pdf',
        });
      }
      
      Alert.alert('Success', `Calendar exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export calendar');
    } finally {
      setExporting(false);
    }
  };

  const shareData = async (content, filename, mimeType) => {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${filename}`;
      await RNFS.writeFile(filePath, content, 'utf8');
      
      await Share.open({
        url: Platform.OS === 'android' ? `file://${filePath}` : filePath,
        type: mimeType,
        filename: filename,
      });
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Share error:', error);
        Alert.alert('Error', 'Failed to share file');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Export Calendar</Text>
          <Text style={styles.subtitle}>
            Export your calendar data in various formats
          </Text>
          
          <Divider style={styles.divider} />
          
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => handleExport('json')}
              loading={exporting}
              disabled={exporting}
              style={styles.exportButton}
              icon="code-json">
              Export as JSON
            </Button>
            
            <Button
              mode="contained"
              onPress={() => handleExport('csv')}
              loading={exporting}
              disabled={exporting}
              style={styles.exportButton}
              icon="file-excel">
              Export as CSV
            </Button>
            
            <Button
              mode="contained"
              onPress={() => handleExport('pdf')}
              loading={exporting}
              disabled={exporting}
              style={styles.exportButton}
              icon="file-pdf-box">
              Export as PDF
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Branding</Text>
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  exportButton: {
    marginBottom: 8,
    backgroundColor: '#667eea',
  },
  brandingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
  },
});

export default ExportScreen;

