const searchBar = document.getElementById("searchBar");
searchBar.addEventListener('keyup', (userString) => {
    const searchString = userString.target.value.toLowerCase();
    const filteredCampgrounds = campgrounds.features.filter((campground) => {
        return (
            campground.title.toLowerCase().includes(searchString) ||
            campground.location.toLowerCase().includes(searchString)
        );
    });  
        for (let i=0; i<filteredCampgrounds.length; i++) {
            let filterID = filteredCampgrounds[i]._id;
        }
}); 

export default filterID