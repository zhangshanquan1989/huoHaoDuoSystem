import Vue from 'vue'
import { Button, Form, FormItem, Input ,Message, Container, Header, Aside, 
Main, Menu, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, 
Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox, Tag,
 Tree, Select, Option, Cascader, Alert, Steps, Step, Tabs, TabPane, Timeline, 
 TimelineItem, Dropdown, DropdownMenu, DropdownItem,Popconfirm,DatePicker,CheckboxGroup,Checkbox,Divider,Calendar} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Popconfirm)
Vue.use(DatePicker)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Divider)
Vue.use(Calendar)

// 下面的使用 与上面的不同，需要全局挂在到Vue原型上
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm


