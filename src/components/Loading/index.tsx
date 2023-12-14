import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  loader: {
    marginRight: 5,
  },
});

export const Loading = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ActivityIndicator size={16} color="black" style={styles.loader} />
        <Text>Loading...</Text>
      </View>
    </View>
  );
};
