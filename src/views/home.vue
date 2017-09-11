<template>
  <div class="container">
    <div class="content home" distance="55" v-pull-to-refresh="refresh">

      <v-layer></v-layer>
      <v-content type="block-title" style="margin: 0 0 0.4rem;
        -webkit-box-shadow: 0 .06rem 0 #ccc;box-shadow: 0 .06rem 0 #ccc;background-color: white;">
        <btn style="margin: .4rem 0 .3rem .6rem;border:0;color:#6d6d72;padding:0">
          活动列表（下拉刷新）
        </btn>
      </v-content>
      <div class="card-container">
        <v-card-container v-for="program in programs | orderBy 'start_time' 1">
          <card type="header">{{program.name}}
            <span :style="{color: program.status === '1' ? 'green': 'gray' }">{{program.status | program_status}}</span>
          </card>
          <card type="content">
            <list type="list">
              <li class="item-content">
                <item type="inner">
                  <item type="title">活动开始时间：</item>
                  <item type="after">{{program.start_time}}</item>
                </item>
              </li>
              <li class="item-content">
                <item type="inner">
                  <item type="title">活动结束时间：</item>
                  <item type="after">{{program.end_time}}</item>
                </item>
              </li>
              <li class="item-content">
                <item type="inner">
                  <item type="title">活动地址：</item>
                  <item type="after">{{program.address}}</item>
                </item>
              </li>
            </list>
          </card>
          <card type="footer">
            <div style="color:gray">
              费用类型：
              <span style="color: orange;">{{program.fee_type | fee_type}}</span>

            </div>
            <p>
              <a v-link="{ path: '/program_detail', replace: true}" class="button">查看详情</a>
            </p>
          </card>
        </v-card-container>
      </div>
    </div>
  </div>
</template>

<script>
import Slider from '../components/Slider'
import Bar from '../components/Bar'
import BarItem from '../components/BarItem'
import VLayer from '../components/PullToRefreshLayer'
import VCardContainer from '../components/Card'
import Btn from '../components/Button'
import Card from '../components/CardItem'
import VContent from '../components/Content'
import List from '../components/List'
import Item from '../components/ListItem'
import qs from 'qs'
import $ from 'zepto'

/**
 * 跨域处理方案
 * 一、环境：vue2+axios+http-proxy-middleware+express/nginx + phalapi
 * 二、处理步骤
 * 1.phalapi API提供者，修改vender/phalapi/kernal/src/Response.php，将$headers的构造函数修改为：
 * protected $headers = array(
 *   'Access-Control-Allow-Origin' => '*',
 *   'Access-Control-Allow-Methods' => 'PUT ,POST, GET, DELETE, OPTIONS',
 *   'Access-Control-Allow-Headers' => 'Content-Type, X-Auth-Token, Origin, X-Requested-With, accept'
 * );
 * 
 * 2.前端
 *  2.1.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
 *  2.2.请求phalapi API时千万记得将url写成: /api/xxx/，而不是：/api/xxx。不然全部都以get请求发送了
 * 
 * 3.http-proxy-middleware配置：
 * proxyTable: {
      '/api': {
        target: 'http://127.0.0.4:80',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
 * 
 * 4.nginx配置
 * 4.1.nginx.conf---sendfile        off;
 * 4.2.vhosts.conf---在静态资源访问的server内部增加
 * location /api/ {
      proxy_pass  http://127.0.0.4:80/;        
   }

 * 5.浏览器可能有缓存影响测试结果，测试时候注意禁用缓存，或主动清除缓存  
 */

// 之前路径写：url: '/api/public',即使明确发POST请求也会被强制改为GET请求，以下是答案，使用解决方案1
// 浏览器机制会把你的连接
// ../PhysicalFitnessTest ? service = User.getInfo
// 重定向成
// ../PhysicalFitnessTest /?service = User.getInfo
// 所以会把POST变为GET
// 解决方案1:
// ../PhysicalFitnessTest /?service = User.getInfo 在? service前面加斜杠
// 解决方案2:
// ../PhysicalFitnessTest/index.php ? service = User.getInfo  写出完整的路径

export default {
  route: {
    data () {
      return this.axios({
        url: '/api/public/',
        method: 'POST',
        params: {service: 'App.Program.GetList', test: '111'}
      }).then(response => {
        this.$set('programs', response.data.data.items)
      })
    }
  },
  ready () {
    $.init()
  },
  data () {
    return {
      banner: [],
      programs: [],
      queryParams: {
        service: 'App.Program.GetList',
        channel: 1,
        pageNo: 1,
        pageSize: 100
      }
    }
  },
  computed: {
    length () {
      return this.programs.length
    }
  },
  methods: {
    refresh () {
      this.axios.post('/api/public/', qs.stringify({service: 'App.Program.GetList', test: '111'}), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      }).then(response => {
        this.$set('programs', response.data.data.items)
        $.pullToRefreshDone('.pull-to-refresh-content')
      })
    }
  },
  components: {
    Slider,
    Bar,
    BarItem,
    VLayer,
    VCardContainer,
    Card,
    VContent,
    List,
    Item,
    Btn
  }
}
</script>

<style>
.container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.home {
  top: -2.2rem !important;
}

.home-bar {
  background: #efeff4;
  height: 2.8rem;
  position: relative;
  box-shadow: 0 .01rem .05rem rgba(0, 0, 0, .3);
}

.home-bar .tab-item {
  height: 2.8rem;
  background-color: white;
}
</style>
