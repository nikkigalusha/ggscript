'use strict'
import React from 'react'
import { connect } from 'react-redux'
import { getLevelData, updateLevel, getLevelPoints } from '../actions'
import Codemirror from 'react-codemirror'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux';
import Hint from '../components/Component_Hint.js'
import DiffLevel from '../components/Component_DiffLevel.js'
import { Router } from 'react-router'

require('../../../node_modules/codemirror/mode/javascript/javascript.js');
require('../../../node_modules/codemirror/addon/edit/matchbrackets.js');
require('../../../node_modules/codemirror/addon/edit/closebrackets.js');
require('../../../node_modules/codemirror/addon/hint/javascript-hint.js');
require('../../../node_modules/codemirror/addon/hint/show-hint.js');

// Styling for modal
const customStyles = {
  overlay: {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(255, 255, 255, .5)',
    zIndex            : '10'
  },
  content : {
    position                   : 'absolute',
    top                        : '10%',
    left                       : '10%',
    right                      : '10%',
    bottom                     : '10%',
    border                     : '3px solid #ccc',
    backgroundColor            : 'rgba(255, 255, 255, 1)',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '30px',
    outline                    : 'none',
    padding                    : '50px',
    zIndex                     : '100'
  }
};

class Learn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "var game = new Phaser.Game(600, 450, Phaser.CANVAS, 'gamebox', { preload: preload, create: create }); \nfunction preload() {\n} \nfunction create() {\n}",
      modalIsOpen: false,
      showError: false
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.refs.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentWillMount(){
    const component = this;
    this.handleError();
    this.props.getLevelData();
  }
  updateCode(newCode) {
    console.log(this, 'this')
    this.setState({
      code: newCode
    });
  }

  handleError() {
    const component = this;
    window.onerror = (messageOrEvent, source, lineno, colno, error) => {
      component.setState({
        error_message: messageOrEvent,
        error_source: source,
        error_lineno: lineno,
        error_colno: colno,
        error: error
      });
      //if the window receives any error, stop game and display error
      component.destroyGame();
      component.displayError();
    }
  }

  displayError() {
    if(document.getElementsByTagName('canvas').length) {
      document.getElementsByTagName('canvas')[0].remove();
    }
    this.setState({showError: true});

  }

  stop() {
    if(window.game.input){
      if(window.game.input.keyboard) {
        window.game.input.keyboard.enabled = false;
        console.log(window.game.input.keyboard.enabled);
      }
    }
  }

  go() {
    if(window.game.input){
      if(window.game.input.keyboard) {
        window.game.input.keyboard.enabled = true;
        console.log(window.game.input.keyboard.enabled);
      }
    }
  }

  startLevel(code, level) {
    var selectedCode = this.props.levelData[code];
    //load the code base based on the user's selected difficulty level;
    this.setState({
      code: selectedCode,
      difficultyLevel: level
    }, function() {
      //after state has been set (happens asyncronously), load code
      this.loadCode();
    });
    this.closeModal();
    this.loadCode();
  }
  refresh() {
    location.reload();
  }

  destroyGame() {
    if(window.game) {
      if(window.game.destroy && window.game.state){
        window.game.destroy();
      }
    }
  }

  runGame(code) {
  }

  generateAndAppendScript() {
    // remove current game script if there is one
    if(document.getElementById('gameScript')){
      document.getElementById('gameScript').remove();
    }
    //add the new code to the newly created script tag
    const script = document.createElement("script");
    script.text = this.state.code;
    script.id = 'gameScript';
    //run the new script by appending it to DOM
    document.getElementById('gameCode').appendChild(script);
  }
  loadCode() {
    //remove any previous error if there is one
    if(this.state.showError) {
      this.setState({showError: false})
    }
    //stop the current game code from running
    this.destroyGame();

    //generate and append new script
    this.generateAndAppendScript();

    //if there is no canvas, display the error page (even if no error has been caught)
    if(!document.getElementsByTagName('canvas').length) {
      this.displayError();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      modalIsOpen: true
    })   
  }

  componentDidMount() {
    this.generateAndAppendScript();
  }

  componentWillUnmount() {
    this.destroyGame();
    document.getElementById('gameScript').remove();
  }

  display() {
    console.log(this.props);
  }

  render() {
    const options = {
      lineNumbers: true,
      mode: 'javascript',
      tabSize: 2,
      lineWrapping: true,
      matchBrackets: true,
      // autoCloseBrackets: true,
      // styleActiveLine: true,
      theme: 'pastel-on-dark',
    };
    return (
      <div id="learnbox">
        {/*pop up modal for giving level description before start*/}
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal">
          <div id='makeVideo'>
          <h1 ref="subtitle">Welcome to Level {this.props.levelData.id}!</h1>
          <h2>{this.props.levelData.levelname}</h2>
          <h3>{this.props.levelData.description_subone}</h3>
          <p id="missionpromptwords2">{this.props.levelData.description_descone}</p>
          <h3>{this.props.levelData.description_subtwo}</h3>
          <p id="missionpromptwords2">{this.props.levelData.description_desctwo}</p>
          <h3>{this.props.levelData.description_subthree}</h3>
          <p id="missionpromptwords2">{this.props.levelData.description_descthree}</p>
          <h3>What difficulty level would you like to complete {this.props.levelData.levelname} at?</h3>
        {/*button for choosing difficulty level*/}
          <DiffLevel level='Novice' completed={this.props.levelData.noviceComplete} points={this.props.levelData.novicepoints}/>
          <DiffLevel level='Heroic' completed={this.props.levelData.heroicComplete} points={this.props.levelData.heroicpoints}/>
          <DiffLevel level='Mythic' completed={this.props.levelData.mythicComplete} points={this.props.levelData.mythicpoints}/>
          <button className="btn btn-default difficulty" onClick={this.startLevel.bind(this, 'novicelevelcode', 'Novice')}>Novice</button>
          <button className="btn btn-default difficulty" onClick={this.startLevel.bind(this, 'heroiclevelcode', 'Heroic')}>Heroic</button>
          <button className="btn btn-default difficulty" onClick={this.startLevel.bind(this, 'mythiclevelcode', 'Mythic')}>Mythic</button>
          </div>
        </Modal>
        <div id="missionprompt">Your Mission:<span id="missionpromptwords"> {this.props.levelData.prompt}</span></div>
        <span onClick={this.stop}>
        <Codemirror id="tutorialCode"value={this.state.code} onChange={this.updateCode.bind(this)} options={options} />
        </span>
        <div id="learnrightside" onClick={this.go}>

          <div id="gamebox">
            {this.state.showError ? <div id="errorconsole">
            <span>UH OH! <br></br><br></br>
              It looks like there is a slight error in your code :(
              But don't worry!  We're here to help you solve it.  Usually it's something very simple, such as a missing open or close parenthesis or bracket.  Luckily, while writing code in Javascript with Phaser, we have access to error messages that give hints as to what and where the error is.  Try looking over the error message below and try to fix it!  If you're unable to get it, don't fret!  Just restart the level and we'll get you coding and gaming again in no time.<br></br>
            </span><br></br>
            {`${this.state.error_message}`}<br></br>
            {`Error Line Number: ${this.state.error_lineno}`}<br></br>
            {`Error Column Number: ${this.state.error_colno}`}<br></br>
            </div> : null}
          </div>
          <div className="text-center">
            <div>
              <span id="prompt">Level:<span id="promptwords"> {this.props.levelData.levelname}</span></span>
             <span id="prompt">Difficulty:<span id="promptwords"> {this.state.difficultyLevel}</span></span>
            </div>
            <div id="learnbuttons">
              <button id="makeVideo" className="btn btn-default padded" onClick={this.loadCode.bind(this)}> Run My Code </button>
              <button id="makeVideo" className="btn btn-default padded" onClick={this.props.updateLevel.bind(this, true, this.props.levelData.id)}> Next Level </button>
              <button id="makeVideo" className="btn btn-default padded" onClick={this.refresh.bind(this)}> Reset Level </button>
            </div>
            <br></br>
            <div id="hints">
              <Hint hint={this.props.levelData.hint1}/>
              <Hint hint={this.props.levelData.hint2}/>
              <Hint hint={this.props.levelData.hint3}/>
            </div>
            <span id="makeVideo"> Use A Hint? </span>
            <span>`{this.props.novicecomplete}`</span>
            <button onClick={this.display.bind(this)}>test</button>
          </div>
        </div>
        <div id="gameCode"></div>
      </div>
      )
  }
}

function mapStateToProps(state){
  console.log('map state to props learn container', state)
  return {
    levelData: state.getLevelData
  }
}

function mapDispatchToProps(dispatch){
  return {
    getLevelData: () => {
      dispatch(getLevelData())
    },
    dispatch: dispatch,
    updateLevel: (advanceBoolean, currlevel) => {
      dispatch(updateLevel(advanceBoolean, currlevel));
    },
    getLevelPoints: () => {
      dispatch(getLevelPoints());
    }
  }
}

const Container_Learn = connect(
  mapStateToProps,
  mapDispatchToProps
)(Learn)

export default Container_Learn
