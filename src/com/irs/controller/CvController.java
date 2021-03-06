package com.irs.controller;

import com.irs.pojo.*;
import com.irs.pojo.cv.TbCvsGz;
import com.irs.pojo.cv.TbCvsJy;
import com.irs.pojo.cv.TbCvsPx;
import com.irs.service.CvService;
import com.irs.service.MsService;
import com.irs.service.PostService;
import com.irs.service.PsndocService;
import com.irs.util.ResultUtil;
import com.irs.util.TurnBPM;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("cv/")
public class CvController {


	@Autowired
	private CvService cvServiceImpl;
	@Autowired
	private PostService postServiceImpl;
	@Autowired
	private PsndocService psndocServiceImpl;
	@Autowired
	private MsService msServiceImpl;

	

	@RequestMapping("cvList")
//	@RequiresPermissions("post:post:list")
	public String cvList(){
		return "page/cv/cvList";
	}
    @RequestMapping("cvRckList")
//	@RequiresPermissions("post:post:list")
    public String cvRckList(){
        return "page/cv/cvRckList";
    }
	@RequestMapping("getCvList")
	@ResponseBody
	public ResultUtil getCvList(Integer page, Integer limit, CvSearch search){
		return cvServiceImpl.selCvs(page,limit,search);
	}
	@RequestMapping("getRckCvList")
	@ResponseBody
	public ResultUtil getRckCvList(Integer page, Integer limit, CvSearch search){
		search.setCvstatus("4");
		return cvServiceImpl.selCvs(page,limit,search);
	}

	/**
	 * 简历列表
	 * **/
	@RequestMapping("getCvList/{uid}")
	@ResponseBody

	public ResultUtil getCvList(Integer page, Integer limit, CvSearch search,@PathVariable("uid")String uid){

			search.setPostid(uid);
		return cvServiceImpl.selCvs(page,limit,search);
	}

	@RequestMapping("cvList/{uid}")
//	@RequiresPermissions("user:user:save")
	public String getCvList(@PathVariable("uid")String uid,Model model){

		TbPosts post=postServiceImpl.selPostByUid(Long.parseLong(uid));
		model.addAttribute("post", post);
		return "page/cv/cvList";
	}

    /**
     * 查看简历
     * dudu
     * 2020年3月5日09:40:44
     **/
	@RequestMapping("checkCv/{uid}")
//    @ResponseBody
	public String checkCv(@PathVariable("uid")String uid, Model model){
		TbPostsCvs tbPostsCvs = cvServiceImpl.selPostCvService(uid);
		TbCvs cv=cvServiceImpl.selCvByCvid(tbPostsCvs.getCvcode());
        List<TbCvsPx> tbCvsPxList =cvServiceImpl.selCvsPxByUid(cv.getCvid());
		List<TbCvsJy> tbCvsJyList =cvServiceImpl.selCvsJyByUid(cv.getCvid());
		List<TbCvsGz> tbCvsGzList =cvServiceImpl.selCvsGzByUid(cv.getCvid());

		model.addAttribute("cv", cv);
		model.addAttribute("postcvid", tbPostsCvs.getUid());
		model.addAttribute("cvjy", tbCvsJyList);
		model.addAttribute("cvgz", tbCvsGzList);
		model.addAttribute("cvpx", tbCvsPxList);
		return "page/cv/checkCv";
	}
	/**
	 * 查看简历
	 * dudu
	 * 2020年3月5日09:40:44
	 **/
	@RequestMapping("checkCv")
//    @ResponseBody
	public String checkCv(){
//		TbCvs cv=cvServiceImpl.selCvByUid(Long.parseLong(uid));
//		model.addAttribute("cv", cv);
		return "page/cv/checkCv";
	}
    /**
     * 转发简历
     * dudu
     * 2020年3月12日09:40:44
     **/
    @RequestMapping("turnCv/{postStr}")
	@ResponseBody
    public ResultUtil turnCv(@PathVariable("postStr")String postStr){

		try {
			cvServiceImpl.insCv2PostService(postStr);
			return ResultUtil.ok();
		} catch (Exception e) {
			e.printStackTrace();
			return ResultUtil.error();
		}
    }
    /**
     * 选择BPM流程处理人
     * **/
    @RequestMapping("bpmCLR/{str}")
    public String bpmCLR(@PathVariable("str")String str, Model model){
        model.addAttribute("postcvid", str);
        return "page/bpm/bpmCLR";
    }
	/**
	 * 人员列表
	 * **/
	@RequestMapping("getPsnList")
	@ResponseBody

	public ResultUtil getPsnList(Integer page, Integer limit, PsnSearch nickname){
		return psndocServiceImpl.selPsndocList(page,limit,nickname);
	}
    /**
     * 触发BPM流程
     * **/
	@RequestMapping("subBpm/{postStr}")
	@ResponseBody
	public ResultUtil subBpm(@PathVariable("postStr")String postStr, Model model){

		TurnBPM turnBPM = new TurnBPM();
		int result =  turnBPM.get(postStr);
		if(result == 0){
            try{
                String[] uid_value = postStr.split(",");
				TbPostsCvs tbPostsCvs = cvServiceImpl.selPostCvService(uid_value[0]);
				tbPostsCvs.setCvstatus("5");
				cvServiceImpl.updPostCvService(tbPostsCvs);
				postStr += ",5";
                msServiceImpl.insMsglPj(postStr);
                return ResultUtil.ok();
            }catch (Exception e){

            }
		}
		return ResultUtil.error("提交失败！");
	}
	/**
	 * 更新职位简历关系表状态
	 * **/
	@RequestMapping("updCvs/{uid}")
	@ResponseBody
	public ResultUtil updCvs(@PathVariable("uid")String uid){
		String[] uid_value = uid.split(",");
        int result = 0;
		try{
			TbPostsCvs tbPostsCvs = cvServiceImpl.selPostCvService(uid_value[0]);
			tbPostsCvs.setCvstatus(uid_value[1]);
			cvServiceImpl.updPostCvService(tbPostsCvs);
		}catch (Exception e){
            result = 1;
	}
		if(result == 0){
			return ResultUtil.ok();
		}
		return ResultUtil.error("提交失败！");
	}
}
