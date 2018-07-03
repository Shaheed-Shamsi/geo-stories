import { createStackNavigator } from 'react-navigation'
import { StyleSheet } from 'react-native'
import UserProfile from './src/components/UserProfile'
import Signup from './src/components/Signup'
import Login from './src/components/Login'
import Home from './src/components/Home'
import MyMap, { MyLocation } from './src/components/MyMap'
import NewPost from './src/components/NewPost'
import TakePicture from './src/components/TakePicture'
import RecordVideo from './src/components/RecordVideo'
import SinglePost from './src/components/SinglePost'
import ActivityLog from './src/components/ActivityLog'

const StackNav = createStackNavigator({
  Home: {
    screen: Home,
    navigationOptions: ({ navigation, header }) => ({
      ...header,
      headerTintColor: '#4519aa',
      title: 'Map',
      headerStyle: { backgroundColor: 'gray', borderWidth: 1, height: 60 },
    })
  },
  MyMap: {
    screen: MyMap,
    navigationOptions: ({ navigation, header }) => ({
      ...header,
      headerTintColor: '#4519aa',
      title: 'Map',
      headerStyle: styles.header
    })
  },
  SinglePost: {
    screen: SinglePost,
    navigationOptions: ({ navigation, header }) => ({
      ...header,
      headerTintColor: '#4519aa',
      title: 'Post',
      headerStyle: styles.header
    })
  },
  UserProfile: {
    screen: UserProfile,
    navigationOptions: ({ navigation, header }) => ({
      ...header,
      headerTintColor: '#4519aa',
      title: 'Profile',
      headerStyle: styles.header
    })
  },
  Signup: {
    screen: Signup,
    navigationOptions: ({ navigation, header }) => ({
      ...header,
      headerTintColor: '#4519aa',
      title: 'Welcome',
      headerStyle: { backgroundColor: 'gray', borderWidth: 1, height: 60 },
    })
  },
  Login: {
    screen: Login,
    navigationOptions: ({ navigation, header }) => ({
      ...header,
      headerTintColor: '#4519aa',
      title: 'Welcome',
      headerStyle: { backgroundColor: 'gray', borderWidth: 1, height: 60 },
    })
  },
  TakePicture: {
    screen: TakePicture
  },
  RecordVideo: {
    screen: RecordVideo
  },
  NewPost: {
    screen: NewPost,
    navigationOptions: ({ navigation, header }) => ({
      ...header,
      headerTintColor: '#4519aa',
      title: 'Add New Post',
      headerStyle: styles.header
    })
  },
  ActivityLog: {
    screen: ActivityLog,
    navigationOptions: ({ navigation, header }) => ({
      ...header,
      headerTintColor: '#4519aa',
      title: 'Activity Log',
      headerStyle: styles.header
    })
  }
})

const styles = StyleSheet.create({
  header: {
    width: '100%',
    
    backgroundColor: 'white',
    borderWidth: 1,
    height: 40
  }
})

export default StackNav
