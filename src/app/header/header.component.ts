import { Component, OnInit } from "@angular/core";
import { AuthService } from "../authentication/auth.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit{
onLogout() {
throw new Error('Method not implemented.');
}  
    private authListenerSubs: Subscription | undefined;
    public userIsAuthenticated = false;

    constructor(private authService: AuthService){}  
    
    ngOnInit(){ 
        this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {  
            this.userIsAuthenticated = isAuthenticated;  
        });
    }  

    ngOnDestroy(){
        if (this.authListenerSubs) {
            this.authListenerSubs.unsubscribe();
        }
  
    }
  }   

function subscribe(arg0: (isAuthenticated: any) => void) {
    throw new Error("Function not implemented.");
}
