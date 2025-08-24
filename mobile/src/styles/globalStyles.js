import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5'
  },
  
  // Card styles
  card: {
    margin: 16,
    elevation: 4,
    borderRadius: 8
  },
  
  cardContent: {
    padding: 16
  },
  
  // Text styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8
  },
  
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8
  },
  
  body: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24
  },
  
  caption: {
    fontSize: 14,
    color: '#666'
  },
  
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4
  },
  
  // Input styles
  input: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  
  inputContainer: {
    marginBottom: 16
  },
  
  inputError: {
    borderColor: '#B00020',
    borderWidth: 1
  },
  
  // Button styles
  button: {
    marginVertical: 8,
    borderRadius: 8
  },
  
  buttonContainer: {
    padding: 16
  },
  
  primaryButton: {
    backgroundColor: '#6200EE',
    marginVertical: 8,
    borderRadius: 8
  },
  
  secondaryButton: {
    borderColor: '#6200EE',
    borderWidth: 1,
    marginVertical: 8,
    borderRadius: 8
  },
  
  dangerButton: {
    backgroundColor: '#B00020',
    marginVertical: 8,
    borderRadius: 8
  },
  
  // Layout styles
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  
  column: {
    flexDirection: 'column'
  },
  
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  spaceBetween: {
    justifyContent: 'space-between'
  },
  
  spaceAround: {
    justifyContent: 'space-around'
  },
  
  // Spacing styles
  margin: {
    margin: 16
  },
  
  marginVertical: {
    marginVertical: 16
  },
  
  marginHorizontal: {
    marginHorizontal: 16
  },
  
  padding: {
    padding: 16
  },
  
  paddingVertical: {
    paddingVertical: 16
  },
  
  paddingHorizontal: {
    paddingHorizontal: 16
  },
  
  // Shadow styles
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  
  lightShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  
  // Avatar styles
  avatar: {
    backgroundColor: '#6200EE'
  },
  
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6200EE'
  },
  
  avatarMedium: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6200EE'
  },
  
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6200EE'
  },
  
  // List styles
  listItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  
  listItemContent: {
    flex: 1,
    paddingHorizontal: 12
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666'
  },
  
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32
  },
  
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 16
  },
  
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8
  },
  
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  },
  
  // Status styles
  statusChip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  
  statusSuccess: {
    backgroundColor: '#4CAF50'
  },
  
  statusWarning: {
    backgroundColor: '#FF9800'
  },
  
  statusError: {
    backgroundColor: '#F44336'
  },
  
  statusInfo: {
    backgroundColor: '#2196F3'
  },
  
  // Divider styles
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  
  // FAB styles
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200EE'
  },
  
  // Badge styles
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  
  // Search styles
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff'
  },
  
  searchBar: {
    elevation: 2,
    borderRadius: 8
  },
  
  // Filter styles
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff'
  },
  
  filterChip: {
    marginRight: 8,
    marginBottom: 8
  },
  
  // Form styles
  form: {
    padding: 16
  },
  
  formGroup: {
    marginBottom: 20
  },
  
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8
  },
  
  formError: {
    fontSize: 14,
    color: '#B00020',
    marginTop: 4
  },
  
  formHelperText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  }
});

export default globalStyles;