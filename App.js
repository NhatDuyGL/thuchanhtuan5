import React, { useMemo, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { books, categories, cartItems } from './data';

const colors = {
  navy: '#172554',
  indigo: '#4f46e5',
  purple: '#7c3aed',
  background: '#f8fafc',
  text: '#172033',
  muted: '#64748b',
  border: '#e2e8f0',
  white: '#ffffff',
  danger: '#ef4444',
  success: '#059669',
};

const money = (value) => `${value.toLocaleString('vi-VN')}đ`;

function Header({ onCart }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.logo}>BookStore</Text>
        <Text style={styles.logoCaption}>Đọc sách, mở tương lai</Text>
      </View>
      <View style={styles.headerActions}>
        <Text style={styles.headerIcon}>⌕</Text>
        <TouchableOpacity onPress={onCart} accessibilityLabel="Mở giỏ hàng">
          <Text style={styles.headerIcon}>🛒</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CategoryChips({ selected, onSelect }) {
  return (
    <View style={styles.chipContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          onPress={() => onSelect(category)}
          style={[styles.chip, selected === category && styles.chipSelected]}
        >
          <Text style={[styles.chipText, selected === category && styles.chipTextSelected]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function Cover({ book, large = false }) {
  return (
    <View style={[styles.coverWrapper, large && styles.largeCoverWrapper]}>
      <Image source={{ uri: book.image }} style={styles.cover} resizeMode="cover" />
      {book.badge && <Text style={styles.saleBadge}>{book.badge}</Text>}
    </View>
  );
}

function GridCard({ book, onPress }) {
  return (
    <TouchableOpacity style={styles.gridCard} onPress={() => onPress(book)}>
      <Cover book={book} />
      <Text style={styles.gridTitle} numberOfLines={2}>{book.title}</Text>
      <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.price}>{money(book.price)}</Text>
        {book.oldPrice && <Text style={styles.oldPrice}>{money(book.oldPrice)}</Text>}
      </View>
    </TouchableOpacity>
  );
}

function ListCard({ book }) {
  return (
    <View style={styles.listCard}>
      <Cover book={book} />
      <View style={styles.listInfo}>
        <View>
          <Text style={styles.listTitle} numberOfLines={2}>{book.title}</Text>
          <Text style={styles.author}>{book.author}</Text>
        </View>
        <Text style={styles.price}>{money(book.price)}</Text>
      </View>
    </View>
  );
}

function FloatingCart({ count, onPress }) {
  return (
    <TouchableOpacity style={styles.floatingCart} onPress={onPress}>
      <Text style={styles.floatingCartIcon}>🛒</Text>
      <View style={styles.countBadge}><Text style={styles.countText}>{count}</Text></View>
    </TouchableOpacity>
  );
}

function BottomTabBar({ active, onChange }) {
  const tabs = [
    ['home', '⌂', 'Trang chủ'],
    ['categories', '▦', 'Danh mục'],
    ['cart', '🛒', 'Giỏ hàng'],
    ['account', '●', 'Tài khoản'],
  ];
  return (
    <View style={styles.tabBar}>
      {tabs.map(([id, icon, label]) => (
        <TouchableOpacity key={id} style={styles.tab} onPress={() => onChange(id)}>
          <Text style={[styles.tabIcon, active === id && styles.activeTab]}>{icon}</Text>
          <Text style={[styles.tabLabel, active === id && styles.activeTab]}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function HomeScreen({ onBook, onCart }) {
  const [selected, setSelected] = useState(null);
  const filteredBooks = selected ? books.filter((book) => book.category === selected) : books;
  return (
    <View style={styles.screen}>
      <Header onCart={onCart} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>BOOKSTORE ONLINE</Text>
          <Text style={styles.heroTitle}>Mỗi trang sách, một hành trình mới</Text>
          <Text style={styles.heroSubtitle}>Khám phá những cuốn sách truyền cảm hứng cho bạn.</Text>
        </View>
        <Text style={styles.sectionTitle}>Danh mục</Text>
        <CategoryChips selected={selected} onSelect={setSelected} />
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sách nổi bật</Text>
          <Text style={styles.seeAll}>{filteredBooks.length} sản phẩm</Text>
        </View>
        <View style={styles.grid}>
          {filteredBooks.map((book) => <GridCard key={book.id} book={book} onPress={onBook} />)}
        </View>
        <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
        {books.slice(0, 3).map((book) => <ListCard key={`list-${book.id}`} book={book} />)}
      </ScrollView>
      <FloatingCart count={cartItems.reduce((sum, item) => sum + item.quantity, 0)} onPress={onCart} />
    </View>
  );
}

function DetailScreen({ book, onBack, onCart }) {
  return (
    <View style={styles.screen}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={onBack}><Text style={styles.backText}>‹</Text></TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Chi tiết sách</Text>
        <TouchableOpacity onPress={onCart}><Text style={styles.headerIcon}>🛒</Text></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.detailScroll} showsVerticalScrollIndicator={false}>
        <Cover book={book} large />
        <Text style={styles.detailTitle}>{book.title}</Text>
        <Text style={styles.detailAuthor}>Tác giả: {book.author}</Text>
        <View style={styles.detailPriceRow}>
          <Text style={styles.detailPrice}>{money(book.price)}</Text>
          {book.oldPrice && <Text style={styles.oldPrice}>{money(book.oldPrice)}</Text>}
        </View>
        <Text style={styles.descriptionTitle}>Mô tả sản phẩm</Text>
        <Text style={styles.description}>{book.description}</Text>
        <Text style={styles.description}>{book.description}</Text>
      </ScrollView>
      <View style={styles.addBar}>
        <View><Text style={styles.mutedSmall}>Tạm tính</Text><Text style={styles.price}>{money(book.price)}</Text></View>
        <TouchableOpacity style={styles.primaryButton} onPress={onCart}><Text style={styles.primaryButtonText}>Thêm vào giỏ</Text></TouchableOpacity>
      </View>
    </View>
  );
}

function CartScreen() {
  const total = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), []);
  return (
    <View style={styles.screen}>
      <View style={styles.detailHeader}><Text style={styles.detailHeaderTitle}>Giỏ hàng</Text><Text style={styles.mutedSmall}>{cartItems.length} sản phẩm</Text></View>
      <ScrollView contentContainerStyle={styles.cartScroll} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View style={styles.cartRow} key={item.id}>
            <Image source={{ uri: item.image }} style={styles.cartImage} />
            <View style={styles.cartName}><Text style={styles.listTitle} numberOfLines={2}>{item.title}</Text><Text style={styles.author}>{item.author}</Text></View>
            <View style={styles.quantity}><Text style={styles.quantityText}>×{item.quantity}</Text></View>
            <Text style={styles.cartPrice}>{money(item.price * item.quantity)}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.summary}>
        <View><Text style={styles.mutedSmall}>Tổng tiền</Text><Text style={styles.detailPrice}>{money(total)}</Text></View>
        <TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryButtonText}>Thanh toán</Text></TouchableOpacity>
      </View>
    </View>
  );
}

function PlaceholderScreen({ title }) {
  return <View style={styles.placeholder}><Text style={styles.placeholderIcon}>✦</Text><Text style={styles.placeholderTitle}>{title}</Text><Text style={styles.muted}>Nội dung giao diện đang được cập nhật.</Text></View>;
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedBook, setSelectedBook] = useState(books[0]);
  const openBook = (book) => { setSelectedBook(book); setScreen('detail'); };
  const renderScreen = () => {
    if (screen === 'detail') return <DetailScreen book={selectedBook} onBack={() => setScreen('home')} onCart={() => setScreen('cart')} />;
    if (screen === 'cart') return <CartScreen />;
    if (screen === 'categories') return <PlaceholderScreen title="Danh mục sách" />;
    if (screen === 'account') return <PlaceholderScreen title="Tài khoản" />;
    return <HomeScreen onBook={openBook} onCart={() => setScreen('cart')} />;
  };
  return (
    <SafeAreaView style={styles.root}>
      {renderScreen()}
      {screen !== 'detail' && <BottomTabBar active={screen} onChange={setScreen} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  screen: { flex: 1, position: 'relative' },
  header: { height: 56, paddingHorizontal: 16, backgroundColor: colors.navy, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: colors.white, fontSize: 21, fontWeight: '800' },
  logoCaption: { color: '#c7d2fe', fontSize: 10 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  headerIcon: { color: colors.white, fontSize: 24 },
  scrollContent: { padding: 16, paddingBottom: 112 },
  hero: { backgroundColor: colors.indigo, borderRadius: 18, padding: 20, marginBottom: 22 },
  heroEyebrow: { color: '#c7d2fe', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  heroTitle: { color: colors.white, fontSize: 24, lineHeight: 30, fontWeight: '800', marginTop: 8 },
  heroSubtitle: { color: '#e0e7ff', marginTop: 8, lineHeight: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginBottom: 12 },
  seeAll: { color: colors.indigo, fontSize: 12, marginBottom: 12 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', alignContent: 'flex-start', gap: 8, marginBottom: 8 },
  chip: { borderWidth: 1, borderColor: colors.indigo, borderRadius: 22, paddingHorizontal: 13, paddingVertical: 8, backgroundColor: colors.white },
  chipSelected: { backgroundColor: colors.indigo },
  chipText: { color: colors.indigo, fontSize: 13 },
  chipTextSelected: { color: colors.white, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { width: '48%', backgroundColor: colors.white, borderRadius: 14, padding: 10, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  coverWrapper: { position: 'relative', width: '100%', aspectRatio: 3 / 4, borderRadius: 9, overflow: 'hidden', backgroundColor: '#e0e7ff' },
  largeCoverWrapper: { width: '62%', alignSelf: 'center', marginBottom: 20 },
  cover: { width: '100%', height: '100%' },
  saleBadge: { position: 'absolute', top: 6, left: 6, backgroundColor: colors.danger, color: colors.white, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 5, fontSize: 11, fontWeight: '800' },
  gridTitle: { color: colors.text, fontSize: 14, fontWeight: '700', lineHeight: 19, marginTop: 9, minHeight: 38 },
  author: { color: colors.muted, fontSize: 12, marginTop: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 5, marginTop: 7 },
  price: { color: colors.indigo, fontWeight: '800', fontSize: 14 },
  oldPrice: { color: '#94a3b8', fontSize: 11, textDecorationLine: 'line-through' },
  listCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.white, borderRadius: 14, padding: 10, marginBottom: 10 },
  listCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.white, borderRadius: 14, padding: 10, marginBottom: 10 },
  listInfo: { flex: 1, marginLeft: 12, minHeight: 110, justifyContent: 'space-between' },
  listCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.white, borderRadius: 14, padding: 10, marginBottom: 10 },
  listCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.white, borderRadius: 14, padding: 10, marginBottom: 10 },
  listTitle: { color: colors.text, fontSize: 14, fontWeight: '700', lineHeight: 19 },
  floatingCart: { position: 'absolute', right: 20, bottom: 82, width: 58, height: 58, borderRadius: 29, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center', elevation: 6 },
  floatingCartIcon: { fontSize: 23 },
  countBadge: { position: 'absolute', top: -3, right: -3, backgroundColor: colors.danger, minWidth: 21, height: 21, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white },
  countText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  tabBar: { height: 68, position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', zIndex: 10 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  tabIcon: { color: colors.muted, fontSize: 20 },
  tabLabel: { color: colors.muted, fontSize: 11 },
  activeTab: { color: colors.indigo, fontWeight: '800' },
  detailHeader: { height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border },
  backText: { color: colors.navy, fontSize: 36, lineHeight: 36 },
  detailHeaderTitle: { color: colors.text, fontWeight: '800', fontSize: 18 },
  detailScroll: { padding: 20, paddingBottom: 105 },
  detailTitle: { color: colors.text, fontWeight: '800', fontSize: 24, lineHeight: 31 },
  detailAuthor: { color: colors.muted, marginTop: 7, fontSize: 14 },
  detailPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  detailPrice: { color: colors.indigo, fontSize: 22, fontWeight: '800' },
  descriptionTitle: { color: colors.text, fontSize: 17, fontWeight: '800', marginTop: 25, marginBottom: 8 },
  description: { color: '#475569', fontSize: 15, lineHeight: 24, marginBottom: 12 },
  addBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  primaryButton: { backgroundColor: colors.indigo, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 13, minWidth: 130, alignItems: 'center' },
  primaryButtonText: { color: colors.white, fontWeight: '800' },
  mutedSmall: { color: colors.muted, fontSize: 12 },
  cartScroll: { padding: 16, paddingBottom: 145 },
  cartRow: { backgroundColor: colors.white, borderRadius: 14, padding: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  cartImage: { width: 54, height: 72, borderRadius: 7 },
  cartName: { flex: 1 },
  quantity: { width: 38, alignItems: 'center' },
  quantityText: { color: colors.muted, fontWeight: '700' },
  cartPrice: { width: 76, textAlign: 'right', color: colors.indigo, fontWeight: '800', fontSize: 12 },
  summary: { position: 'absolute', left: 0, right: 0, bottom: 68, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 68 },
  placeholderIcon: { color: colors.indigo, fontSize: 42, marginBottom: 12 },
  placeholderTitle: { color: colors.text, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  muted: { color: colors.muted },
});
