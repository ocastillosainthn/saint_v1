


<script>
  import { ref } from 'vue';
  import {
    kPage,
    kNavbar,
    kPanel,
    kBlock,
    kBlockTitle,
    kLink,
    kButton,
    kCard,
    kNavbarBackLink,
    kList,
    kListGroup,
    kListItem,
    kSearchbar,
    kFab,
    kPopup,
    kListInput,
    kToast,
    



  } from 'konsta/vue';

  export default {
    components: {

      kPage,
      kNavbar,
      kNavbarBackLink,
      kPanel,
      kBlock,
      kBlockTitle,
      kLink,
      kButton,
      kCard,
      kList,
      kListGroup,
      kListItem,
      kSearchbar,
      kFab,
      kPopup,
      kListInput,
      kToast,
    },



  

  };
</script>



<style>
.container {
  padding: 20px;
  display: block;
  background-color: white;
}

.shrink {
font-size: 13px;
}

.p-inputtext{
  border-width: 1px;
  border-style: solid;
  border-color: rgb(217, 217, 217);
  width: 100%;
}

.p-calendar{
margin-left: 0px;
}

label{
  font-size: 14px;
  color: gray;
}

.p-checkbox-box{
  border-width: 1px;
  border-style: solid;
  border-color: rgb(217, 217, 217);
}

.p-dropdown{
  padding:0px
}

.addUser{

  display: flex; justify-content: center!important; color: rgb(22, 74, 164);
}

.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.centerTittleAction{
  display: flex;
  align-items: center;
  justify-content:space-between ;
  margin-top: 20px;
  margin-bottom: 20px;
}

.containerSearch {
  background-color: #ebebeb4c; padding: 10px; display: flex;
  border-bottom-color: rgb(235, 235, 235);
  border-bottom-style:solid;
  border-bottom-width: 1px;


}

.columnflex{
  display: flex;
}

.columnForm{
  margin-bottom: 10px;
  width:100%;
}
</style>
