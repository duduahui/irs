package com.irs.util;

import java.util.Calendar;

/**
 * @author dudu
 * @create 2020-04-09 9:50
 */


public class GetAge{

    public String evaluate(String sfzjh){

        if(sfzjh == null || "".equals(sfzjh) ){
            return "身份证件号有误,无法计算年龄";
        }

        if (sfzjh.length() != 15 && sfzjh.length() != 18){
            return "身份证件号有误,无法计算年龄";
        }

        String age="身份证件号有误,无法计算年龄";

//        CheckSFZ sf = new CheckSFZ(); // 调用校验身份证的函数，若身份证完全正确，此处可以不需要
//        sfzjh = sf.evaluate(sfzjh);

        if(sfzjh != "身份证件号有误"){

            Calendar cal = Calendar.getInstance();
            int yearNow = cal.get(Calendar.YEAR);
            int monthNow = cal.get(Calendar.MONTH)+1;
            int dayNow = cal.get(Calendar.DATE);

            int year = Integer.valueOf(sfzjh.substring(6, 10));
            int month = Integer.valueOf(sfzjh.substring(10,12));
            int day = Integer.valueOf(sfzjh.substring(12,14));

            if ((month < monthNow) || (month == monthNow && day<= dayNow) ){
                age = String.valueOf(yearNow - year);
            }else {
                age = String.valueOf(yearNow - year-1);
            }

        }

        return age;
    }

//   public static void main(String[] args) {
//       GetAge ga = new GetAge();
//       String sfzjh = "360731199701024351";
//        int year = Integer.valueOf(sfzjh.substring(6, 10));
//        int month = Integer.valueOf(sfzjh.substring(10,12));
//        int day = Integer.valueOf(sfzjh.substring(12,14));
//        System.out.println(year + "-"+month+"-"+day);
//        System.out.println(ga.evaluate("360731199701024351"));
//
//    }

}