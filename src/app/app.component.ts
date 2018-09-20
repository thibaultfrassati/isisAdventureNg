import { Component, Input, ViewChildren, QueryList } from '@angular/core';
import { RestserviceService } from './services/restservice.service';
import { World, Pallier, Product } from './class/world';
import { ProductComponent } from './product/product.component';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers : [ToasterService],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Je suis une roleX';

  @ViewChildren(ProductComponent) productsComponent: QueryList<ProductComponent>;

  world: World = new World();
  server: string;
  qtmulti: any;
  money: any;
  score:any;
  username: string;
  manAv: any;
  toasterService: ToasterService;

  constructor(private service: RestserviceService, toasterService: ToasterService) {
    this.server = service.getServer();
    service.setUser(this.username);
      service.getWorld().then(
        world => {
          this.world = world;
        });
      this.toasterService = toasterService;
      }

      onProductionDone(p:Product){
        this.world.money+=p.revenu*p.quantite;
        this.world.score+=p.revenu*p.quantite;
        this.ManagersAvailable();
      }


      ngOnInit() {
 		this.qtmulti=1;
        this.money=this.world.money;
        this.score=this.world.score;
      }

      onBuy(n:number){
        this.world.money-=n;
        this.ManagersAvailable();
        let min = this.world.products.product[0].quantite;
        this.world.products.product.forEach(p =>{if(p.quantite<min){min=p.quantite;}});
        var obj = this;
      }


    toggleMulti(){
      if(this.qtmulti == 1){
        this.qtmulti=10;
      }else if(this.qtmulti==10){
        this.qtmulti=100;
      }else if(this.qtmulti==100){
        this.qtmulti="MAX";
      }else{
        this.qtmulti=1;
      }
    }


 ManagersAvailable(){
      this.manAv = false;
      this.world.managers.pallier.forEach(manager => {
        if(!manager.unlocked){
          if(this.world.money>=manager.seuil){
          	console.log("débloque");
            this.manAv = true;
          }
        }
      })
    }

    hireManager(m:Pallier){
      if(this.world.money>=m.seuil){
        this.onBuy(m.seuil);
        m.unlocked=true;
        this.world.products.product[m.idcible-1].managerUnlocked=true;
        console.log(this.toasterService);
        this.toasterService.pop('success','Manager engagé !',m.name);
      }
    }

  }
