package com.controller;

import org.springframework.transaction.annotation.Transactional;
import com.entity.User;
import com.service.UserService;
import com.service.FileService;
import com.repository.UserRepository;
import org.json.JSONObject;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.w3c.dom.html.HTMLParagraphElement;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;

@Controller    // This means that this class is a Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path="/user") // This means URL's start with /demo (after Application path)
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FileService fileService;

    @PostMapping(path="/add",consumes = MediaType.APPLICATION_JSON_VALUE) // Map ONLY POST Requests
    public  ResponseEntity<?> addNewUser (@RequestBody User user) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        userService.addUser(user);
        System.out.println("Saved");
        return new ResponseEntity(null,HttpStatus.CREATED);
    }

    @GetMapping(path="/all",produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody Iterable<User> getAllUsers() {
        // This returns a JSON with the users
        return userService.getAllUsers();
    }

//    @PostMapping(path="/login",consumes = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<?> login(@RequestBody String user, HttpSession session)
//    {
//        JSONObject jsonObject = new JSONObject(user);
//        session.setAttribute("name",jsonObject.getString("username"));
//        return new ResponseEntity(userService.login(jsonObject.getString("username"),jsonObject.getString("password")),HttpStatus.OK);
//    }

//    @PostMapping(path="/doSignup", consumes=MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<?> signUp(@RequestBody String user, HttpSession session)
//    {
//        User usr = null;
//        JSONObject jsonObject = new JSONObject(user);
//        session.setAttribute("name", jsonObject.getString("email"));
//
//        System.out.println("email");
//        System.out.println(jsonObject.getString("email"));
//        usr.setEmail(jsonObject.getString("email"));
//        usr.setName(jsonObject.getString("firstname"));
//        usr.setPassword(jsonObject.getString("password"));
//        userService.signUp(usr);
//        return new ResponseEntity(userService.login(jsonObject.getString("email"),jsonObject.getString("password")),HttpStatus.OK);
//    }

    @PostMapping(path="/login", consumes=MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<?> login(@RequestBody String requestBody){
        HashMap<String, String> response = new HashMap<String, String>();
        JSONObject jsonObject=null;
        String password=null;
        String username=null;
        try{
            jsonObject = new JSONObject(requestBody);
            password=jsonObject.getString("password");
            username=jsonObject.getString("username");
        }catch(JSONException e){
            e.printStackTrace();
        }
        User loguser = userService.login(username,password);

        System.out.println(userService.login(username,password));
        response.put("_id", loguser.getId().toString());
        response.put("email", loguser.getEmail());
        response.put("phone", loguser.getPhone());

        return new ResponseEntity(response,HttpStatus.OK);
    }

    @PostMapping(path="/signup", consumes=MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<?> signUp(@RequestBody String requestBody){
        HashMap<String,String> response= new HashMap<String, String>();
        JSONObject jsonObject=null;
        String password=null;
        String email=null;
        String username = null;
        String phone = null;
        User user = new User();
        try {
            jsonObject = new JSONObject(requestBody);
            password=jsonObject.getString("password");
            email=jsonObject.getString("email");
            username = jsonObject.getString("username");
            phone = jsonObject.getString("phone");

            //orgListJsonArray=jsonObject.getJSONArray("orglist");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        user.setEmail(email);
        user.setPassword(password);
        user.setUsername(username);
        user.setPhone(phone);

        User reguser=userRepository.save(user);

        response.put("Status","Success");
        response.put("_id",reguser.getId().toString());
        response.put("email", reguser.getEmail());
        response.put("stat","logged in");

        System.out.println(response);

        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PostMapping(path="/createGroup", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createGroup(@RequestBody User[] members, @RequestBody String userId){
        HashMap<String,String> response= new HashMap<String, String>();
        JSONObject jsonObject = new JSONObject(members);
        userService.createGroup(members, userId);
        response.put("Status", "success");
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PostMapping(path="/showgroup", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> showGroups(@RequestBody String userId){
        HashMap<String,String> response= new HashMap<String, String>();
        JSONObject jsonObject = new JSONObject(userId);
        String[] groups = userService.getGroups(userId);
        String groupList = "";
        for(int i=0; i<groups.length; i++){
            groupList = groupList + groups[i];
        }
        response.put("Status", "success");
        response.put("grouplist", groupList);
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PostMapping(path="/getmembers", consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getMembers(@RequestBody String userId){
        HashMap<String,String> response= new HashMap<String, String>();
        JSONObject jsonObject = new JSONObject(userId);
        String[] groups = userService.getMembers(userId);
        String memberList = "";
        for(int i=0; i<groups.length; i++){
            memberList = memberList + groups[i];
        }
        response.put("Status", "success");
        response.put("grouplist", memberList);
        return new ResponseEntity(response, HttpStatus.OK);
    }

    @PostMapping(path="/getfiles",consumes=MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getFile(@RequestBody String user)
    {
        JSONObject jsonObject = new JSONObject(user);
        System.out.println("called");
        return new ResponseEntity(fileService.getFiles(),HttpStatus.OK);
    }

    @PostMapping(value = "/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<?> logout(HttpSession session) {
        System.out.println(session.getAttribute("name"));
        session.invalidate();
        return  new ResponseEntity(HttpStatus.OK);
    }
}