import React, { Component } from 'react';
import { 
	Animated, 
	// Button, 
	Dimensions, 
	Image, 
	Linking, 
	Picker,
	StyleSheet, 
	Text, 
  View,
  TouchableOpacity
} from 'react-native';

import { MapView, Video } from 'expo';
import { connect } from 'react-redux'
import { getAllPostsThunk, getSinglePostThunk, getAllCategoriesThunk, filterIdThunk } from '../store'
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog'
import { Button } from 'react-native-elements'

const { width, height } = Dimensions.get('window');

// const CARD_HEIGHT = height / 4;
// const CARD_WIDTH = CARD_HEIGHT - 50;
const CARD_HEIGHT = 105;
const CARD_WIDTH = 140;

class MyMap extends Component {
		// constructor(){
		// 	super()
			state = {
				currentMarker: null,
        // focusedLocation: {
					latitude: 41.89557129,
					longitude: -87.6386050932,
					// latitudeDelta: 0.00522,
					// longitudeDelta:
					// Dimensions.get('window').width /
					// Dimensions.get('window').height * 0.00522
				// }
			}
			// this.callOutHide = this.callOutHide.bind(this)
			// this.callOutShow = this.callOutShow.bind(this)
		// }
			
		callOutShow = () => {
			this.currentMarker.showCallout();
		}
	
		callOutHide = () => {
			this.currentMarker.hideCallout();
		}
	
		componentWillMount() {
			this.index = 0;
			this.animation = new Animated.Value(0);
		}

		componentDidMount() {
      this.setState({
        latitude: this.props.defaultLocation.latitude,
        longitude: this.props.defaultLocation.longitude
      })
			this.props.viewAllPosts()
			this.props.viewAllCategories()

			let posts = this.props.allPosts

			// We should detect when scrolling has stopped then animate
			// We should just debounce the event listener here
			this.animation.addListener(({ value }) => {
				let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
				if (index >= this.props.allPosts.length) {
					index = this.props.allPosts.length - 1;
				}
				if (index <= 0) {
					index = 0;
				}
	
				clearTimeout(this.regionTimeout);
				this.regionTimeout = setTimeout(() => {
					if (this.index !== index) {
						// this.callOutHide();
						this.index = index;
						const post = this.props.allPosts[index];

						
						this.setState({
									latitude: this.props.allPosts[index].latitude,
									longitude: this.props.allPosts[index].longitude,
						})
						
						console.log( 'Pick Location lat:' + 
							this.state.latitude + ' long:' + 
							this.state.longitude
						)

						this.map.animateToRegion(
							{
								latitude: this.props.allPosts[index].latitude,
								longitude: this.props.allPosts[index].longitude,
								// latitudeDelta: this.state.focusedLocation.latitudeDelta,
								// longitudeDelta: this.state.focusedLocation.longitudeDelta,
							},
							350
						);
						this.callOutShow();
					}
				}, 10);
			});
		}
	
    pickLocationHandler = (event) => {
        const coords = event.nativeEvent.coordinate;
        this.setState(prevState => {
            return {
                // focusedLocation: {
                    // ...prevState.focusedLocation,
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                
            }
        })
    }

    render() {
      const videoExt = ['mp4', 'mp3', 'avi', 'flv', 'mov', 'wmv'];
      // let newreg = this.state.focusedLocation
      let newreg = {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: 0.00522,
        longitudeDelta: Dimensions.get('window').width /
        Dimensions.get('window').height * 0.00522
      }
        return (
            <View style={styles.container}>
                <MapView
          				ref={map => this.map = map}
                    initialRegion={newreg}
                    region={newreg}
                    style={styles.map}
                    onPress={this.pickLocationHandler}
                >
                    {!!this.props.filterId === false ? this.props.allPosts.map((marker, index) => {
                        let newCoord = {
                            latitude: marker.latitude,
                            longitude: marker.longitude
                        }
												console.log('New Marker index: ', this.index )
                        return (
                            <MapView.Marker
								                // ref={ref => { this.currentMarker = ref; }}
								                ref={ref => { if(this.index === index) { this.currentMarker = ref; /* this.callOutShow();*/ } }}
																style={styles.mapMarker}
                                key={index}
                                coordinate={newCoord}
                                title={marker.title}
                                description={'Click to See Post'}
                                onCalloutPress={() => this.props.navigation.navigate('SinglePost', { id: marker.id })}
                            >
                            </MapView.Marker>

                        );
                    }) :
                        this.props.allPosts.map((marker, index) => {
                            let newCoord = {
                                latitude: marker.latitude,
                                longitude: marker.longitude
                            }
														// console.log('New Marker index: ', this.index )
                            if (marker.categoryId === this.props.filterId) {
                                return (
                                    <MapView.Marker
												                // ref={ref => { if(this.index === index) { this.currentMarker = ref} }}
																				ref={ref => { if(this.index === index) { this.currentMarker = ref; /* this.callOutShow(); */ } }}
                                        key={index}
																				style={styles.mapMarker}
                                        coordinate={newCoord}
                                        title={marker.title}
                                        description={marker.text}
                                        onCalloutPress={() => this.props.navigation.navigate('SinglePost', { id: marker.id })}
                                    >
                                    </MapView.Marker>
                                );
                            }
                        })

                    }
                </MapView>
				<View style={styles.container}>
                
          <Animated.ScrollView
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: this.animation,
                    },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
            style={styles.scrollView}
            contentContainerStyle={styles.endPadding}
          >
            {this.props.allPosts.map((marker, index) => (
              <View style={styles.card} key={index}>

                {videoExt.indexOf(marker.mediaLink.slice(-3)) !== -1 ? 
                <Video 
									source={{uri: marker.mediaLink}} 
									rate={1.0}
									volume={0}
									muted={false}
									resizeMode="cover"
									shouldPlay
									isLooping
									style={styles.cardImage} 
                /> :

                <Image 
									style={styles.cardImage} 
									source={{uri: marker.mediaLink}} 
                  resizeMode='cover'
								/>

                }

                <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>{marker.title}</Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>
                    {marker.text}
                  </Text>
                </View>
              </View>
            ))}
          </Animated.ScrollView>
				</View> 
				<View style={styles.container}>

                <View style={styles.button}>
                    <View><Button title='Category Filter' buttonStyle={styles.filterButton} onPress={() => this.popupDialog2.show()}/></View>
                    <View><Button title="Post" buttonStyle={styles.buttonPost} onPress={() => this.props.navigation.navigate('NewPost')} /></View>
                    <View><Button title="Locate Me" buttonStyle={styles.buttonLocate} onPress={() => alert('Pick Location lat:' + this.state.latitude + ' long:' + this.state.longitude)} /></View>
                </View>
				</View> 
                    <PopupDialog
                        width={0.5}
                        height={0.3}
                        overlayOpacity={0.6}
                        haveTitleBar={true}
                        ref={(popupDialog) => { this.popupDialog2 = popupDialog }}>
                        <View style={styles.container}>
                            <Text style={styles.title}>Category Filter</Text>
                             <Picker
                              selectedValue={this.props.filterId}
                              style={{ height: 100, width: 100, position: "absolute", top: 100}}
                              onValueChange={(itemValue, itemIndex) => this.props.changeFilterId(itemValue)}>
                              <Picker.Item label="All" value={0} />
                              {this.props.allCategories.map((category,index) =>{
                              	return <Picker.Item key={index} label={category.title} value={category.id} />
                            })}
                          </Picker> 
                        </View>
                    </PopupDialog>

			</View> 
        )
    }
}

export function MyLocation(){
	alert('Pick Location lat:' + 
	this.state.latitude + ' long:' + 
	this.state.longitude)
}

const styles = StyleSheet.create({
  container: {
		flex: 1,
    width: '100%',
    alignItems: 'center'
	},
	
  map: {
    // borderWidth: 1,
    // borderColor: 'red',
    backgroundColor: '#eee',
    width: '100%',
    height: 500
	},

	mapMarker:{
		alignItems: 'center',
	},
  // containerButton: {
	// 	flex: 2,
	// 	flexDirection: 'row',
  //   width: '100%',
  //   // alignItems: 'center'
	// },

	button: {
			margin: 8,
			marginTop: 30,
			// alignSelf: 'flex-start',
			alignItems: 'center',
		flexDirection: 'row',			
	},

filterButton: {
			backgroundColor: 'green',
	},
	title: {
			fontSize: 20,
			fontWeight: 'bold'
	},
	link: {
			color: 'black',
			fontSize: 16
	},
	buttonPost: {
			backgroundColor: 'red',
	},
	buttonLocate: {
			backgroundColor: 'blue',
	},
	filterText: {
			
	},
scrollViewContainer: {
    flex: 1,
  },
  scrollView: {
    position: 'absolute',
    // bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 5,
    // borderWidth: 1,
    // borderColor: 'red',
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 3,
    elevation: 2,
    backgroundColor: '#FFF',
    marginHorizontal: 3,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x : 2, y : -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
    // borderWidth: 1,
    // borderColor: 'red',
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 8,
    marginTop: 3,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 8,
    color: "#444",
  },
});

const mapStateToProps = state => {
    return {
        allPosts: state.postReducer.allPosts,
        singlePost: state.postReducer.singlePost,
        allCategories: state.categoryReducer.allCategories,
        filterId: state.categoryReducer.filterId,
        defaultLocation: state.postReducer.currentLocation
    }
}

const mapDispatchToProps = dispatch => {
    return {
        viewAllPosts: () => dispatch(getAllPostsThunk()),
        viewSinglePost: (postId) => dispatch(getSinglePostThunk(postId)),
        viewAllCategories: () => dispatch(getAllCategoriesThunk()),
        changeFilterId: (filterId) => dispatch(filterIdThunk(filterId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyMap)

