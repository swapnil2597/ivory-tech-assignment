import { View, StyleSheet } from 'react-native';

export const NotificationSkeleton = () => {
  return (
    <View style={styles.card}>
      <View style={styles.badge} />
      <View style={styles.lineShort} />
      <View style={styles.lineLong} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  badge: {
    width: 80,
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 12,
  },
  lineShort: {
    width: '60%',
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 8,
  },
  lineLong: {
    width: '90%',
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
  },
});
