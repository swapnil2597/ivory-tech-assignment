import {
    View,
    Text,
    StyleSheet,
    Pressable,
  } from 'react-native';
  import { Notification } from '../types/notification';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  
  dayjs.extend(relativeTime);
  
  interface Props {
    item: Notification;
    onPress: () => void;
  }
  
  const badgeColors: Record<string, string> = {
    transactional: '#3498db',
    marketing: '#2ecc71',
    alert: '#e74c3c',
    reminder: '#9b59b6',
  };
  
  export const NotificationItem = ({
    item,
    onPress,
  }: Props) => {
    return (
      <Pressable onPress={onPress} style={[
        styles.card,
        !item.isRead && {borderWidth: 1.5, borderColor: badgeColors[item.type]},
      ]}>
        <View style={styles.headerRow}>
          <View
            style={[
              styles.badge,
              { backgroundColor: badgeColors[item.type] },
            ]}
          >
            <Text style={styles.badgeText}>
              {item.type.toUpperCase()}
            </Text>
          </View>
  
          <Text style={styles.time}>
            {dayjs(item.createdAt).fromNow()}
          </Text>
        </View>
  
        <View style={styles.contentRow}>
          {/* {!item.isRead && <View style={styles.unreadDot} />} */}
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.title,
                !item.isRead && styles.unreadTitle,
              ]}
            >
              {item.title}
            </Text>
            <Text
              numberOfLines={1}
              style={styles.body}
            >
              {item.body}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#fff',
      padding: 16,
      marginHorizontal: 16,
      marginVertical: 4,
      borderRadius: 6,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    badgeText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: '600',
    },
    contentRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#3498db',
      marginRight: 8,
      marginTop: 6,
    },
    title: {
      fontSize: 16,
      marginBottom: 4,
    },
    unreadTitle: {
      fontWeight: 'bold',
    },
    body: {
      fontSize: 14,
      color: '#666',
    },
    time: {
      fontSize: 12,
      color: '#999',
    },
  });
  