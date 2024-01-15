<template>
    <div class="project-card">
        <p style="font-size: 12px; color: rgb(171, 171, 171);   " >{{ state }}</p>
      <p style="margin-bottom: 0px; font-size: 27px;  ">{{ name }}</p>
      <p style="color: rgb(188, 188, 188); margin-bottom: 20px; font-size: 13px;">{{ uuid }}</p>
      <Div style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
        <p style="color: rgb(26, 26, 26);">{{ url }}</p>
        <div class="arrowHover" > 
        <Icon name="material-symbols-light:arrow-right-alt-rounded" style="font-size: 25px; "/>
        </div>
      </Div>
     
    </div>
  </template>
  
  <script>


  export default {
    props: {
      name: String,
      uuid: String,
      state: String,
      url: String
    }
  }




  </script>
  
  <style scoped>
  .project-card {
    border: 1px solid #f0f0f0;
    padding: 20px;
    margin: 10px 0;
    border-radius: 8px;
    background-color: white;
    cursor: pointer;
  }
  
  .project-card h3 {
    margin: 0 0 10px;
  }
  
  .project-card {

  border: 1px solid #e5e5e5; 
  transition: border-color 0.3s, box-shadow 0.3s; 
  cursor: pointer;

}

.project-card:hover {
  border-color: #5f2efe;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); 
}


.arrowHover{
    background-color: #f7f7f7e0;
    border-radius: 5px;
    padding: 5px;
}

  </style>
  