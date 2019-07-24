const appComponents = require('./components.js'),
  data = require('./data.js');

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
    data: data,
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
