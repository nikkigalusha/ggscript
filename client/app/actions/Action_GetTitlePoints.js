function loadDiffLevelPointsUponResponse(data){
  return {type: 'LOAD_DIFF_LEVEL_POINTS', data}
};

function getDiffLevelPoints() {
  return function(dispatch){
    fetch(`api/titlepoints`, {
      method: 'GET',
    })
    .then(response => {
      response.json().then(res => {
        dispatch(loadDiffLevelPointsUponResponse(res))
      })
      .catch(err => {console.log(err)})
    }).catch(err => {
      console.log('Cannot get title points', err);
    });
    return null;
  };
}

export { getDiffLevelPoints }
