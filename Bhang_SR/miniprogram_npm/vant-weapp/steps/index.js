import { VantComponent } from '../common/component';
import { GREEN } from '../common/color';
import { getJobimportReDo, getUserTrack  } from '../../../utils/api.js';
VantComponent({
    props: {
        icon: String,
        steps: Array,
        active: Number,
        direction: {
            type: String,
            value: 'horizontal'
        },
        activeColor: {
            type: String,
            value: GREEN
        },
        activeIcon: {
            type: String,
            value: 'checked'
        },
        inactiveIcon: String
    },
    onLoad: function () {
      this.setData({
        steps: this.props.steps,
      })
    },
    methods: {
      // 重新执行
      replaystep(e){
        var that = this;
        if (this.data.replaying){
          return false;
        }
        
        console.log(e.currentTarget.dataset.index)
        let $index = e.currentTarget.dataset.index;
        let $data = that.data.steps
        console.log($data)
        if ($data[$index].result){
          return false;
        }
        that.triggerEvent('myevent', true)
        $data[$index].replaying = true;
        that.setData({ steps: $data, replaying:true})
        let params = { interviewImportId: $data[$index].interviewImportId, step: $data[$index].step, userId: $data[$index].userId, jobId: $data[$index].jobid}
        console.log(params)
        getJobimportReDo(params).then(res=>{
          console.log(res)
          if(res.status){
            console.log(that.data.steps)
            let $params = { userId: $data[$index].userId, interviewImportId: $data[$index].interviewImportId }
            getUserTrack($params).then(resp => {
              console.log(resp)
              if (resp.status) {
                resp.body.tracks.map(item => {
                  item.userId = $data[$index].userId;
                  item.interviewImportId = $data[$index].interviewImportId;
                  item.jobid = $data[$index].jobid
                  if (item.status == 1 || item.status == -2) {
                    item.result = true
                  } else {
                    item.result = false
                  }
                })
                for (let i = 0; i < resp.body.tracks.length; i++) {
                  if (resp.body.tracks[i].status == -1) {
                    resp.body.tracks[i].status = -3
                    break
                  }
                }
                wx.showToast({
                  title: resp.body,
                  mask: true,
                  icon: 'none',
                  duration: 1000
                })
                that.setData({ steps: resp.body.tracks, replaying: false, stepView: resp.body.stepView})
                that.triggerEvent('Eventupdata', { userid: $data[$index].userId, viewtext: resp.body.stepView,status:resp.body.status})
              }
            })
          }
        })
      }
    }
});
