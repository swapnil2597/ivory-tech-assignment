import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Notification } from '../types/notification';
import AntDesign from '@expo/vector-icons/AntDesign';

dayjs.extend(relativeTime);

interface Props {
  visible: boolean;
  notification: Notification | null;
  onClose: () => void;
}

const typeColors: Record<string, string> = {
  transactional: '#3498db',
  marketing: '#2ecc71',
  alert: '#e74c3c',
  reminder: '#9b59b6',
};

export const NotificationModal = ({
  visible,
  notification,
  onClose,
}: Props) => {
  if (!notification) return null;

  const color = typeColors[notification.type];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View
          style={[
            styles.header,
            { backgroundColor: color },
          ]}
        >
          <View style={styles.headerTopRow}>
            <Text style={styles.typeText}>
              {notification.type.toUpperCase()}
            </Text>

            <Pressable onPress={onClose}>
              {/* <Text style={styles.close}>Close</Text> */}
              <AntDesign name="close" size={24} color="white" />
            </Pressable>
          </View>

          <Text style={styles.title}>
            {notification.title}
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.content}
        >
          {/* Metadata Section */}
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>
              Received
            </Text>
            <Text style={styles.metaValue}>
              {dayjs(notification.createdAt).format(
                'DD MMM YYYY, hh:mm A'
              )}
            </Text>

            <Text style={styles.metaSub}>
              {dayjs(notification.createdAt).fromNow()}
            </Text>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: notification.isRead
                      ? '#2ecc71'
                      : '#e67e22',
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {notification.isRead
                  ? 'Read'
                  : 'Unread'}
              </Text>
            </View>
          </View>

          {/* Body Section */}
          <View style={styles.bodyCard}>
            <Text style={styles.sectionTitle}>
              Message
            </Text>

            <Text style={styles.bodyText}>
              {notification.body}
            </Text>
          </View>

          {/* ID Section (Full Detail) */}
          <View style={styles.metaCard}>
            <Text style={styles.sectionTitle}>
              Technical Details
            </Text>

            <Text style={styles.metaLabel}>
              Notification ID
            </Text>
            <Text style={styles.metaValue}>
              {notification.id}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  close: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  metaCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
  },
  bodyCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  metaLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  metaSub: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
