import {
  View,
  TextInput,
  SectionList,
  Text,
} from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { fetchNotifications } from '../data/mockNotifications';
import { Notification } from '../types/notification';
import { NotificationItem } from '../components/NotificationItem';
import { NotificationModal } from '../components/NotificationModal';
import { NotificationSkeleton } from '../components/NotificationSkeleton';
import { useDebounce } from '../hooks/useDebounce';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAGE_SIZE = 10;

export default function Home() {
  const [allData, setAllData] = useState<Notification[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400); // 400ms debounce 
  const [selected, setSelected] =
    useState<Notification | null>(null);

  useEffect(() => {
    fetchNotifications().then((res) => {
      setAllData(res);
      setLoadingInitial(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!debouncedSearch) return allData;
    return allData.filter(
      (n) =>
        n.title
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        n.body
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        n.type
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) 
    );
  }, [debouncedSearch, allData]);

  const visibleData = filtered.slice(0, visibleCount);

  // Group into sections
  const sections = useMemo(() => {
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const earlier: Notification[] = [];

    visibleData.forEach((item) => {
      const date = dayjs(item.createdAt);
      if (date.isSame(dayjs(), 'day')) {
        today.push(item);
      } else if (
        date.isSame(dayjs().subtract(1, 'day'), 'day')
      ) {
        yesterday.push(item);
      } else {
        earlier.push(item);
      }
    });

    const result = [];
    if (today.length)
      result.push({ title: 'Today', data: today });
    if (yesterday.length)
      result.push({ title: 'Yesterday', data: yesterday });
    if (earlier.length)
      result.push({ title: 'Earlier', data: earlier });

    return result;
  }, [visibleData]);

  const loadMore = () => {
    if (loadingMore) return;
    if (visibleCount >= filtered.length) return;

    setLoadingMore(true);

    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 300); // 300ms simulated delay
  };

  const handleOpenNotification = (
    notification: Notification
  ) => {
    // Mark as read
    setAllData((prev) =>
      prev.map((n) =>
        n.id === notification.id
          ? { ...n, isRead: true }
          : n
      )
    );
    setSelected(notification);
  };

  if (loadingInitial) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {[...Array(6)].map((_, i) => (
          <NotificationSkeleton key={i} />
        ))}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TextInput
        placeholder="Search notifications..."
        placeholderTextColor={'#888'}
        value={search}
        onChangeText={setSearch}
        style={{
          margin: 16,
          padding: 12,
          borderRadius: 6,
          backgroundColor: '#ffff',
        }}
      />

      {sections.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 40 }}>
          No notifications found
        </Text>
      ) : (
        <SectionList // Sectionlist used instead of Flatlist because there had to be different sections of data under 'Today', 'Yesterday' and 'Earlier'.
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              onPress={() =>
                handleOpenNotification(item)
              }
            />
          )}
          renderSectionHeader={({ section }) => (
            <Text
              style={{
                marginLeft: 16,
                marginTop: 16,
                fontSize: 14,
                fontWeight: '600',
                color: '#555',
              }}
            >
              {section.title}
            </Text>
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <NotificationSkeleton key={i} />
                ))}
              </>
            ) : null
          }
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}

      <NotificationModal
        visible={!!selected}
        notification={selected}
        onClose={() => setSelected(null)}
      />
    </SafeAreaView>
  );
}
