function loadTitlePointsUponResponse(data){
  return {type: 'LOAD_TITLE_POINTS', data}
};

function getTitlePoints() {
  return function(dispatch){
    fetch(`api/titlepoints`, {
      method: 'GET',
    })
    .then(response => {
      response.json().then(res => {
        dispatch(loadTitlePointsUponResponse(res))
      })
      .catch(err => {console.log(err)})
    }).catch(err => {
      console.log('Cannot get title points', err);
    });
    return null;
  };
}

export { getTitlePoints }
