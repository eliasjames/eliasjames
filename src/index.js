const appComponents = require('./components.js');

addEventListener('load', ()=>{
  new Vue({
    el: '#overvue',
    components: appComponents,
    computed: {
      getCurrentSubMenu() {
        const menu = this.$data.topnav.options.find(e => {
          return e.menuName === (this.$data.currentSubMenu);
        })
        return menu.nav.options;
      }
    },
    data: {
      currentContent: 'A',
      currentSubMenu: 'one',
      siteName: 'overvue',
      topnav: {
        options: [
          {
            active: true,
            menuName: 'one',
            nav: {
              options: [
                'A',
                'B',
                'C'
              ]
            }
          },
          {
            menuName: 'two',
            nav: {
              options: [
                'D',
                'E',
                'F'
              ]
            }
          },
          {
            menuName: 'three',
            nav: {
              options: [
                'G',
                'H',
                'I'
              ]
            }
          }
        ]
      }
    },
    methods: {
      handleTopnavClick(menuName) {
        this.selectSubMenu(menuName);
        const currentNav = this.$data.topnav.options.find(e => e.menuName === menuName);
        this.$data.topnav.options.forEach(e => e.active = false);
        currentNav.active = true;
      },
      selectContent(contentName) {
        this.$data.currentContent = contentName;
      },
      selectSubMenu(menuName) {
        this.$data.currentSubMenu = menuName;
      }
    }
  });
});
