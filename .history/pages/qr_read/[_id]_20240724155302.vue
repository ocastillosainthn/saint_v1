<template>
  <div>
    <div v-if="loading" class="loadingPage">
      <k-preloader style="display: flex;" size="w-5 h-5" />
    </div>

    <k-page style="background-color: #f7f7f7;">
      <k-navbar title="" small class="top-0 sticky" style="background-color: white;">
        <template #left>
          <k-navbar-back-link text="" @click="goBack" />
        </template>
      </k-navbar>

      <div v-if="visita && visita.division && visita.division.entidad">
        <div style="background-color:white; padding: 15px; margin-bottom: 0px;">
          <div>
            <p class="fontTitle">{{ visita.nombre }} </p>
            <div style="display:flex; margin-bottom: 15px; margin-top: px; align-items: center; color: gray;">
              <p style="font-size: 13px; font-weight: 500;">{{ visita.division.name }} </p>
              <Icon name="solar:arrow-right-linear" style="font-size: 17px; margin-right: 7px; margin-left:7px" />
              <p style="font-size: 13px; font-weight: 500;">{{ visita.division.entidad.name }} </p>
            </div>
            <div style="display: flex;">
              <div style="display: flex; flex-direction: column; align-items: center;">
                <Icon name="solar:calendar-add-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-bottom: 3px;" />
                <div style="width: 1px; height: 34%; background-color:gray; margin-bottom: 3px;"> </div>
                <Icon name="solar:stopwatch-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-right: 0px;" />
              </div>
              <div style="font-size: 11px; margin-left: 10px; width: 100%">
                <div> Válido Desde </div>
                <div style="font-size: 14px; margin-bottom: 15px;"> {{ fechaAmigable }} </div>
                <div> Hasta </div>
                <div style="font-size: 14px;"> {{ fechaFinAmigable }} </div>
              </div>
            </div>

            <div v-if="fechaFinPasada" class="alert">
              <Icon name="solar:shield-warning-bold" style="font-size: 22px; color: red; margin-top: 0px; margin-right: 0px;" />
              Esta visita ya no está disponible
            </div>

            <div style="display: flex; margin-top: 20px;">
              <div style="display: flex; flex-direction: column; align-items: center;">
                <Icon name="solar:user-check-broken" style="font-size: 17px; color: gray; margin-top: 0px; margin-bottom: 3px;" />
              </div>
              <div style="font-size: 11px; margin-left: 10px; width: 100%;" >
                <div> Invitación creada por </div>
                <div style="font-size: 15px; margin-bottom: 1px;"> {{ visita.created_by.name }} </div>
                <p v-if="visita && visita.created_by">
                  {{ visita.created_by.player_id }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style="padding: 15px; padding-top: 20px; background-color: white; margin-top: 10px;">
        <div style="display: flex; justify-content:space-between ;">
          <div style="font-weight: 700; margin-bottom: 10px;"> Participantes </div>
          <div style="font-size: 14px;">
            Acompañantes: {{ visita?.cant }}
          </div>
        </div>
        <Listbox :options="participantes" filter optionLabel="persona.nombre" class="w-full md:w-14rem">
          <template #option="{ option }">
            <div style="display: flex; justify-content: space-between;" @click="seleccionarParticipante(option)">
              <div style="width:60%;">
                <div style="display: flex; flex-direction: column;">
                  {{ option.persona.nombre }}
                  <span style="color:gray; font-size: 13px;">
                    {{ option.persona.empresa ? option.persona.empresa.nombre : '' }}  {{ option.persona.puesto }}
                  </span>
                </div>
              </div>

              <kButton v-if="!option.entrada" style="width:30%; height: 40px;" @click.stop="marcarEntrada(option.id)"> ENTRADA </kButton>
              <kButton v-if="option.entrada && !fechaFinPasada && !option.salida" style="width:30%; height: 40px; background-color: red;" @click.stop="marcarSalida(option.id)"> SALIDA </kButton>
              <Icon v-if="option.salida && !fechaFinPasada" name="solar:shield-check-bold" style="font-size: 40px; margin-right: 7px; margin-left:7px; color: #65AE2C;" />
            </div>
          </template>
        </Listbox>
      </div>
    </k-page>
  </div>
</template>




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
  kPreloader
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
    kPreloader,
    kToast,
  },
};
</script>

  




<style>
input{
    border-width: 1px;
    border-style: solid;
    border-color: rgb(209, 209, 209);
}

.fontTitle{
    margin-top: 15px; 
    font-size: 30px;  
    line-height: 1 ; 
    font-weight: 700;
    margin-bottom: 20px;
}

.alert{
    width:100%;
    padding: 10px;
    background-color: rgba(255, 0, 0, 0.126) ;
    border-color: rgb(233, 72, 72);
    border-width: 1px;
    border-style: solid;
    border-radius: 7px;
    margin-top: 15px;
    color: red;
    font-weight: 700;
    font-size: 12px;
    text-align:center;
}


.popMedia{
  height: 65vh!important;
  top: 70Vh;
}


</style>