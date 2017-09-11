<template>
  <v-app>
    <v-layout row>
      <v-flex sm12>
        <v-toolbar class="indigo text--lighten-2" dark>
          <v-btn icon @click="plusClicked">
             <v-icon >add</v-icon>
          </v-btn>
          <v-btn icon>
             <v-icon>search</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <form  v-if="showCreateOrUpdateItem">
           <v-select label="Tipo de Gasto" v-model="tipo_gasto_object" :items="tipo_gasto_list" item-text="nome" @blur="blurSelectedItem" required></v-select>
           <v-flex xs12 sm6>
             <v-menu lazy  :close-on-content-click="false"  v-model="menu"  transition="scale-transition" offset-y full-width  :nudge-left="40" max-width="290px">
               <v-text-field slot="activator" label="Escolha a data no menu" v-model="actualItem.data" prepend-icon="event" readonly ></v-text-field>
               <v-date-picker v-model="actualItem.data" no-title scrollable actions>
                 <template scope="{ save, cancel }">
                   <v-card-actions>
                     <v-btn flat primary @click.native="cancel()">Cancelar</v-btn>
                     <v-btn flat primary @click.native="save()">Confirmar</v-btn>
                   </v-card-actions>
                 </template>
               </v-date-picker>
             </v-menu>
          </v-flex>
           <v-text-field label="Valor" v-model="actualItem.valor"  required ></v-text-field>
           <v-text-field label="Detalhe" v-model="actualItem.detalhe"  required ></v-text-field>
           <v-btn @click="submit">Confirmar</v-btn>
           <v-btn @click="cancel">Cancelar</v-btn>
       </form>
        <v-data-table v-model="selected" v-bind:headers="headers" v-bind:items="items"  select-all v-bind:pagination.sync="pagination" selected-key="name" class="elevation-1">
          <template slot="headers" scope="props">
            <tr>
              <th>
                <v-checkbox primary hide-details @click.native="toggleAll" :input-value="props.all" :indeterminate="props.indeterminate"></v-checkbox>
              </th>
              <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']" @click="changeSort(header.value)">
                <v-icon>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="items" scope="props">
            <tr :active="props.selected" @click="props.selected = !props.selected">
              <td>
                <v-checkbox primary  hide-details :input-value="props.selected"></v-checkbox>
              </td>
              <td>
                <v-btn  purple lighten-4 icon @click.native="removeItem(props.item);">
                   <v-icon dark> delete </v-icon>
                </v-btn>
              </td>
              <td>
                <v-btn  purple lighten-4 icon @click.native="editItem(props.item)" >
                   <v-icon dark> edit </v-icon>
                </v-btn>
              </td>
              <td class="text-xs-right">{{ props.item.tipo_gasto }}</td>
              <td class="text-xs-right">{{ props.item.data }}</td>
              <td class="text-xs-right">{{ props.item.valor }}</td>
              <td class="text-xs-right">{{ props.item.usuario }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex >
    </v-layout>
  </v-app>
</template>
<script>
  import axios from 'axios';
  export default {
    name: 'Gasto',
    data () {
      return {
        pagination: {
         sortBy: 'valor'
       },
       menu: false,
       modal: false,
       selected: [],
       showCreateOrUpdateItem: false,
       data: '',
       valor: '',
       detalhe: '',
       tipo_gasto: '',
       tipo_gasto_object: '',
       actualItem: {},
        headers: [
          { text: 'Excluir', value: 'excluir'},
          { text: 'Editar', value: 'editar'},
          { text: 'Tipo de gasto', value: 'tipo_de_gasto'},
          { text: 'Data', value: 'data' },
          { text: 'Valor', value: 'valor' },
          { text: 'Usuário', value: 'usuario' },
        ],
        items: [],
      }
    },
    methods: {
      blurSelectedItem() {
        console.log(this.tipo_gasto_object);
        this.actualItem.tipo_gasto_object = this.tipo_gasto_generico_object;
      },
      toggleAll () {
        if (this.selected.length) this.selected = [];
        else this.selected = this.items.slice();
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending;
        } else {
          this.pagination.sortBy = column;
          this.pagination.descending = false;
        }
      },
      idFromUrl(an_url) {
        return parseInt(an_url.split('/').reverse()[0]);
      },
      plusClicked() {
        this.showCreateOrUpdateItem = true;

      },
      clearFields() {
        this.tipo_gasto = null;
        this.valor = '';
        this.data = '';
        this.detalhe = '';
      },
      populateFields() {
        this.tipo_gasto = this.actualItem.tipo_gasto
        this.valor = this.actualItem.valor;
        this.data = this.actualItem.data;
        this.detalhe = this.actualItem.detalhe;
      },
      populateItem() {
        this.actualItem.tipo_gasto = this.tipo_gasto.id;
        this.actualItem.valor = this.valor;
        this.actualItem.data = this.data;
        this.actualItem.detalhe = this.detalhe;
      },
      updateOrNewItem() {
        if (this.actualItem.id != null)
          return this.updateItem();
        this.newItem();
     },
      newItem() {
        this.actualItem = {};
        this.populateItem();
        axios.post(this.url, this.actualItem).then( response => {
            if (response.status == 201) {
              this.actualItem.id = this.idFromUrl(response.headers['content-location']);
              this.items.push(this.actualItem);
              this.clearFields();
              this.actualItem = {};
            }
          })
        .catch(error => {
          console.log(error);
        });
      },
      updateItem() {
        this.tipo_gasto = this.actualItem.tipo_gasto;
        this.populateItem();
        axios.put(this.url + this.actualItem.id + "/", this.actualItem).then( response => {
            if (response.status == 204)
                this.clearFields();
        })
        .catch(error => {
          console.log(error);
        });
      },
      editItem(item) {
          this.actualItem = item;
          this.showCreateOrUpdateItem = true;
      },
      removeItem(item) {
        let index = this.items.indexOf(item);
        axios.delete(this.url + item.id + "/").then( response => {
            console.log('deleted: '+ index);
            if (index > -1)
              this.items.splice(index, 1);
        })
        .catch(error => {
          console.log(error);
        });
      },
      submit() {
        this.updateOrNewItem();
      },
      cancel() {
        this.actualItem = {};
        this.showCreateOrUpdateItem = false;
      },
      getAllGastos() {
        return axios.get("gasto-list/");
      },
      getAllTipoGasto() {
        return axios.get("tipo-gasto-list/");
      },
    },
    created: function () {
      this.url = "gasto-list/";
      this.actualItem = {};
      axios.all([this.getAllGastos(), this.getAllTipoGasto()])
        .then(axios.spread((response_gastos, response_tipos)=> {
          this.items = response_gastos.data;
          this.tipo_gasto_list = response_tipos.data;
        }))
        .catch(error => {
          console.log(error);
        })
    }
  }
</script>
