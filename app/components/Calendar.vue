<template lang="jade">
#calendar
  #head
    #date(@click="backToToday") {{ formatMonth }} {{ year }}
    #action
      .action(href="javascript:void(0)", @click="prev", style="transform: rotate(180deg)") ➔
      .action(href="javascript:void(0)", @click="next") ➔

    #week
      .grid.first() {{ 'Wk' }}
      .grid(v-for="i in 7") {{ weeks[i] }}
  #weeknr
    .grid.square.week(v-for="i in amountOfWeeks") {{ (firstWeekNumber + i) > 52 ? ((52 - (firstWeekNumber + i)) * -1) : (firstWeekNumber + i) }}
  #day
    .grid.square.last(v-for="i in lastMonthRestDays") {{ lastMonthLastDayNumber - ( lastMonthRestDays - 1 - i) }}
    .grid.square(v-for="i in daysOfMonth", :class="{ current: day === i + 1 && isCurrentDay }") {{ i + 1 }}
    .grid.square.next(v-for="i in nextMonthRestDays") {{ i + 1 }}
  #tool-bar
    #menu.tool(@click="popUpMenu") &#9776;
    #calendar-app.tool
      img(src="../assets/images/calendar.png", @click="launchCalendar")
</template>

<script>
  import moment from 'moment'

  let mb = window.remote.require('./').mb
  let shell = window.remote.require('shell')
  let app = window.remote.require('app')
  let Menu = window.remote.require('menu')
  let MenuItem = window.remote.require('menu-item')

  moment.locale(app.getLocale())

  export default {
    data(){
      return {
        today: moment().format('YYYY-MM-DD'),
        menu: '',
        weeks: moment.weekdaysShort()
      }
    },

    computed: {
      formatMonth(){
        return moment(this.today).format('MMM')
      },

      day(){
        return moment(this.today).date()
      },

      month(){
        return moment(this.today).month()
      },

      year(){
        return moment(this.today).year()
      },

      lastMonth(){
        return this.lastMonth = moment(this.today).get('month') - 1
      },

      firstDayWeekNumber(){
        return moment(this.today).startOf('month').day()
      },

      firstWeekNumber(){
        const todayInstance = moment(moment(this.today));
        const lastMonthWeekNr = todayInstance.month(this.month).startOf('month').isoWeek();
        return this.lastMonthRestDays ? lastMonthWeekNr : lastMonthWeekNr + 1
      },

      lastMonthLastDayNumber(){
        let todayInstance = moment(moment(this.today))
        return todayInstance.month(this.lastMonth).endOf('month').date()
      },

      amountOfWeeks(){
        return Math.ceil(42 / 7);
      },

      lastMonthRestDays(){
        let todayInstance = moment(moment(this.today))
        // console.log('todayInstance',todayInstance);
        let lastDayOfLastMonth = todayInstance.month(this.lastMonth).endOf('month').day()
        // console.log('lastDayOfLastMonth',lastDayOfLastMonth);
        return lastDayOfLastMonth === 6 ? 0 : lastDayOfLastMonth + 1
      },

      daysOfMonth(){
        return moment(this.today).endOf('month').date()
      },

      nextMonthRestDays(){
        // console.log('nextMonthRestDays',42 - (this.lastMonthRestDays + this.daysOfMonth));
        return 42 - (this.lastMonthRestDays + this.daysOfMonth)
      },

      isCurrentDay(){
        return moment().format('YYYY-MM-DD') === moment(this.today).format('YYYY-MM-DD')
      }
    },

    methods: {

      tick(){
        if (localStorage.getItem('trayDateFormat') === '') {
        } else {
          mb.tray.setTitle(localStorage.getItem('trayDateFormat') === null ? '' : moment().format(localStorage.getItem('trayDateFormat')))
        }
      },

      prev(){
        this.today = moment(this.today).subtract(1, 'month')
      },

      next(){
        this.today = moment(this.today).add(1, 'month')
      },

      backToToday(){
        this.today = moment().format('YYYY-MM-DD')
      },

      launchCalendar(){
        shell.openItem('/Applications/Calendar.app')
      },

      launchSettings(){
        this.$parent.view = 'Settings'
      },

      popUpMenu(){
        this.menu.popup(window.remote.getCurrentWindow())
      }

    },

    ready(){

      // menu
      let menu = new Menu()
      let cultus = this
      menu.append(new MenuItem({
        label: 'Preferences',
        click(){
          cultus.$parent.view = 'Preference'
        }
      }))
      menu.append(new MenuItem({ type: 'separator' }));
      menu.append(new MenuItem({
        label: 'Quit',
        click(){
          app.quit()
        }
      }))

      this.menu = menu

      // initial time
      this.tick()
      mb.on('show', () => {
        this.backToToday()
      })
      setInterval( () => {
        this.tick()
      }, 800)
    }
  }
</script>

<style scoped>
  #calendar{
    -webkit-user-select: none;
    cursor: default;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;

    .grid{
      display: inline-block;
      width: 14.285%;
      text-align: center;

      &.square{
        border-radius: 2px;
        font-weight: lighter;
        color: #777;
        font-size: .9em;
        box-sizing: border-box;
        padding-top: .7em;
        padding-bottom: .7em;

        &.last{
          background-color: #F5F5F5;
        }

        &.next{
          background-color: #F5F5F5;
        }

        &.current{
          background: linear-gradient(to bottom, #7BBFE0, #75ABDD);
          color: #fff;
        }
      }
    }

    #head{
      width: 100%;
      background: linear-gradient(to bottom, #7BBFE0, #75ABDD);
      position: relative;
      text-align: center;
      color: #fff;
      padding-top: .7em;
      #date{
        font-size: 1.1em;
      }

      #action{
        position: absolute;
        top: 1em;
        right: .5em;
        font-weight: 800;
        .action{
          color: #E3EFF9;
          margin-right: .8em;
          display: inline-block;
          &:hover{
            color: #fff;
          };
        }
      }

      #date{
        font-size: 1.1em;
        display: inline-block;
        cursor: pointer;
      }

      #week{
        position: relative;
        width: 100%;
        height:100%;
        padding: .8em 0;
        font-size: .75em;
        color: #fff;

        .grid{
          display: inline-block;
          width: 13.14%;

          &.first{
            width: 8%;
          }
        }
      }

    }

    #day{
      box-sizing: border-box;
      display: inline-block;
      padding: .2em;
      padding-bottom: 0;
      width: 91.2%;
    }

    #weeknr{
      display: inline-block;
      width: 8%;
      text-align: center;
      padding: .2em 0 .2em .2em;

      .grid{
        &.week{
          background-color: #e6f2ff;
          width: 100%;
        }
      }
    }

    #tool-bar{
      background: linear-gradient(to bottom, #7BBFE0, #75ABDD);
      overflow: hidden;
      padding: .35em;
      .tool{
        display: inline-block;
        float: right;
        /*padding: .4em;*/
        &#calendar-app{
          left: .8em;
          img{
            padding: .1em;
          }
        }

        &#menu{
          color: #E3EFF9;
          margin-left: 1em;
          margin-right: .5em;

          &:hover{
            color: #fff;
          }
        }
      }
    }
  }
</style>
