import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  useWindowDimensions
} from 'react-native';

import Orientation from 'react-native-orientation-locker';

const statusBarHeight = StatusBar.currentHeight || 0;
const unmuteIcon = require('./img/unmute.png'); // Update the path
const muteIcon = require('./img/mute.png'); // Update the path

// Placeholder image for the video feed
const frontCameraImage = require('./img/front-camera-mock.png');
const backCameraImage = require('./img/back-camera-mock.png');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

//let isPortrait = true;
let counter = 0;

const App = () => {
  const [meetingClicked, setMeetingClicked] = useState(false); // State for meeting click
  const [isCalling, setIsCalling] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const transcriptIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    Orientation.lockToPortrait(); // Lock the orientation to portrait
    return () => {
      if (transcriptIntervalRef.current) {
        clearInterval(transcriptIntervalRef.current);
      }
      Orientation.unlockAllOrientations(); // Reset orientation on unmount
    };
  }, []);

  const joinLobby = () => {
    joinCall();
  };

  const joinCall = () => {
    setIsCalling(true);
    // Start transcript generation logic here...
    transcriptIntervalRef.current = setInterval(() => {
      setTranscript((prev) => {
        const newTranscript = [...prev, `[${counter}] New transcript line...`];
        
        // Scroll to the bottom when a new line is added
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }

        counter++;

        return newTranscript;
      });
    }, 3000);
  };

  const endCall = () => {
    setIsCalling(false);
    setTranscript([]);
    setIsMuted(false); // Reset mute state
    setMeetingClicked(false); // Reset meeting clicked state
    clearInterval(transcriptIntervalRef.current!);
    transcriptIntervalRef.current = null;
    counter = 0;
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const toggleCamera = () => {
    setIsFrontCamera((prev) => !prev);
  };

  const handleMeetingClick = () => {
    setMeetingClicked(true); // Update meeting clicked state
  };

  return (
    <SafeAreaView style={styles.container}>
      {isCalling ? (
        <>
          <View style={styles.joinedContainer}>
            <View style={styles.selfVideoContainer}>
              <Image
                source={isFrontCamera ? frontCameraImage : backCameraImage}
                style={styles.selfVideo}
              />
              <Image
                source={isMuted ? muteIcon : unmuteIcon} // Conditional rendering of icons
                style={styles.muteIcon}
                />
            </View>
            <View style={styles.videoContainer}>
              <Image
                source={require('./img/caller-profile-mock.jpg')}
                style={styles.videoIcon}
              />
              <Image
                source={unmuteIcon} // Conditional rendering of icons
                style={styles.muteIcon}
                />
            </View>
            <View style={styles.controls}>
            <View style={styles.leftControls}>
              <View style={styles.muteButton}>
                <Button title={isMuted ? "Unmute" : "Mute"} onPress={toggleMute}/>
              </View>
              <Button title={"Flip Camera"} onPress={toggleCamera} />
            </View>
            <View style={styles.rightControls}>
              <Button title="End Call" onPress={endCall} />
            </View>
            </View>
            <View style={styles.transcriptContainer}>
              <Text style={styles.transcriptTitle}>Transcript:</Text>
              <ScrollView ref={scrollViewRef} style={styles.scrollView}>
                {transcript.map((line, index) => (
                  <Text key={index} style={styles.transcriptLine}>{line}</Text>
                ))}
              </ScrollView>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.lobbyContainer}>
          <Image source={require('./img/google-meet-icon.png')} style={styles.googleMeetIcon}/>
          <Text style={styles.googleMeetMockText}>Mock Google Meet</Text>
          <Text style={styles.lobbyTitle}>Welcome!</Text>
          <Text style={styles.lobbySubTitle}>Join a Video Call Room to Get Started</Text>
          <View
            style={styles.fakeMeetingRoom}
            onTouchEnd={handleMeetingClick} // Detect touch/click
          >
            <Text style={styles.meetingRoomText}>Fake Meeting Room</Text>
            <Text style={styles.meetingRoomTime}>Starting Now</Text>
            <Text style={styles.meetingRoomDescription}>
              Click here to join the call!
            </Text>
          </View>
          {/* Show Join Call button only if the meeting is clicked */}
          {meetingClicked && (
            <View style={styles.joinCallButton}>
              <Button title="Join Call" onPress={joinLobby}/>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  joinedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#202125',
    position: 'absolute',
    padding: 20,
  },
  selfVideoContainer: {
    position: 'absolute',
    top: screenHeight * 0.02,
    width: screenWidth * 0.9,
    height: screenHeight * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3C4043',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#3C4043',
    elevation: 5, // Adds a shadow effect on Android
  },
  selfVideo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  videoContainer: {
    position: 'absolute',
    top: screenHeight * 0.34,
    width: screenWidth * 0.9,
    height: screenHeight * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3C4043',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#3C4043',
    elevation: 5, // Adds a shadow effect on Android
  },
  videoIcon:{
    width: '10%',
    height: '15%',
    borderRadius: 100,
  },  
  controls: {
    position: 'absolute',
    top: screenHeight * 0.66,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  leftControls: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
  },
  muteButton: {
    marginRight: screenWidth * 0.04,
  },
  rightControls: {
    marginLeft: 'auto',
  },
  transcriptContainer: {
    marginTop: 20,
    alignItems: 'flex-start',
    width: '100%',
    height: screenHeight * 0.25,
    position: 'absolute',
    top: screenHeight * 0.71,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  transcriptTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  transcriptLine: {
    marginVertical: 2,
  },
  scrollView: {
    maxHeight: 200, // Limit height for scrolling
    width: '100%',
  },
  muteIcon: {
    width: '10%', // Set the desired size
    height: '15%', // Set the desired size
    marginRight: 10, // Space between icon and button
    position: 'absolute',
    top: '3%',
    right: '-2%',
    backgroundColor: 'gray',
    borderRadius: 100,
  },
  lobbyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lobbyTitle: {
    fontSize: 36,
    position: 'absolute',
    top: screenWidth * 0.4,
  },
  lobbySubTitle: {
    fontSize: 20,
    position: 'absolute',
    top: screenWidth * 0.55,
  },
  fakeMeetingRoom: {
    position: 'absolute',
    top: screenHeight * 0.4,
    width: 300,
    height: 200,
    backgroundColor: '#e0e0e0', // Background color for the fake meeting room
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#bdbdbd',
    borderWidth: 2,
    elevation: 5, // Adds a shadow effect on Android
  },
  meetingRoomText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  meetingRoomTime: {
    margin: 10,
  },
  meetingRoomDescription: {
    textAlign: 'center',
  },
  googleMeetIcon: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    position: 'absolute',
    top: screenHeight * 0.01,
  },
  googleMeetMockText: {
    position: 'absolute',
    top: screenHeight * 0.11,
    fontSize: 18,
  },
  joinCallButton: {
    position: 'absolute',
    top: screenHeight * 0.67,
  }
});

export default App;
