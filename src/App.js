import React from 'react';
import 'semantic-ui-css/semantic.min.css'
import FormComponent from './components/FormComponent'
import SearchComponent from './components/SearchComponent'

function App() {
  return (
    <div
      style={styles.app}
    >
      <SearchComponent/>
      <FormComponent/>
    </div>
  );
}

const styles={
  app: {
    width: '100%',
    height: 800,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
}

export default App;
