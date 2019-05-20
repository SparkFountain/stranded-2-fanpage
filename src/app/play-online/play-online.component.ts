import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-play-online',
  templateUrl: './play-online.component.html',
  styleUrls: ['./play-online.component.scss']
})
export class PlayOnlineComponent implements OnInit {
  @Output() startGame: EventEmitter<void> = new EventEmitter<void>();

  private icons: string[];
  public randomIcon: string[];

  constructor() {
    this.icons = [
      'aerie', 'airpotion', 'airweed', 'arbalest', 'arrow_fire', 'arrow_wood', 'axe', 'bag',
      'baldbush01', 'ball', 'bamboo', 'bamboohut01', 'bamboohut02', 'bamboohut03', 'bambooitem', 'bambootower',
      'banana', 'bananapalm', 'bandage', 'bangfungus', 'bark', 'barrel', 'bendablebranch', 'berries', 'berrybush',
      'bigstorage', 'bird01', 'birdnest', 'blackboard', 'bloodleaf', 'blueblossom', 'boards', 'boards', 'boardwall',
      'bolt', 'bone', 'bottle', 'bottlemessage', 'bow', 'bownet', 'branch', 'branches_01_a', 'bread', 'broadsword',
      'broken_bownet', 'broken_well', 'buildplace_water', 'buildplace', 'bullet', 'bush01_a', 'bush01', 'bush02',
      'bush03', 'bush04', 'bush05', 'bush06', 'bush07', 'bush08', 'bush09', 'bush10', 'bush11', 'bush12', 'bush13',
      'bush14', 'butterflies', 'butterfly01', 'butterfly02', 'butterflygarden', 'cacao', 'cacaofruit', 'cacaotree',
      'cave', 'chieftain', 'chocopaste', 'claw', 'clawmonkey', 'clawspear', 'coconut', 'coconutpalm', 'coffeefruits',
      'coffeetree', 'cookie', 'coral01_a', 'coral01', 'cord', 'cotton_a', 'cottonplant', 'covering', 'crab',
      'crate01', 'crystal01', 'crystal02', 'crystalblade', 'crystalrock', 'defensetower', 'desk', 'dragonfly',
      'dugout', 'eagle', 'excrement', 'explosivebait', 'explosivebarrel', 'feather', 'fence01', 'fence02', 'fence03',
      'fence04', 'fir01', 'fire01', 'fire02', 'firefly', 'firestone', 'fish01', 'fish02', 'fish03', 'fishingrod',
      'fishitem', 'floracarnivora', 'flour', 'flowers01', 'flowers02', 'flowers03', 'flowers04', 'flowers05',
      'flowers06', 'flowers07', 'flowers08', 'flowers09', 'flowers10', 'fly', 'fountain', 'friedfishitem',
      'friedmeat', 'fungus01', 'fungus02', 'fungus03', 'fungus04', 'fungus05', 'gate', 'goldbag', 'goldbow',
      'goldnugget', 'goldrock', 'grain', 'grainbundle', 'grainpile', 'grape', 'grapevine', 'gras01_a',
      'gras01', 'gras02', 'grasshopper', 'guidepost01', 'guidepost02', 'hammer', 'hammock', 'healthpotion',
      'hemp', 'hempleaf_a', 'herb01', 'herb02', 'herb03', 'herb04', 'herbalgarden', 'house', 'hugepalm01', 'hut',
      'immortalpotion', 'insects', 'iron', 'ironbar', 'ironbolt', 'jetty01', 'jetty02', 'jetty03', 'joint',
      'juice', 'key', 'kiwi', 'kiwibreeding', 'kiwinest', 'leaf', 'leaf01_a', 'leaf02_a', 'leaf03_a', 'leaf04_a',
      'leaf05_a', 'leaf06_a', 'leaves01_a', 'leaves02_a', 'leaves03_a', 'liana', 'liana01_a', 'liana02_a',
      'lianapalm', 'lianatree', 'lion', 'lionstone', 'lockpick', 'longbow', 'map', 'marble01', 'marble01',
      'marble03', 'marble04', 'matchet', 'meadow01', 'meat', 'medikit', 'metalrock', 'monkex_carrier',
      'monkey', 'monkeyschool', 'moss', 'moss01_a', 'native', 'needles01_a', 'net', 'palisade',
      'palm01', 'palm02', 'palm03', 'palm04', 'palm05', 'palm06', 'parrot', 'parrotnest', 'paste', 'pearl',
      'pebbles', 'pickaxe', 'piranha', 'pirate', 'pistol', 'plane', 'plums', 'poison', 'poisonflower',
      'prof', 'raptor', 'raptornest', 'reed', 'remotetrigger', 'rock01', 'rock02', 'rock03', 'rock04',
      'rock05', 'rock06', 'rocketlauncher', 'roots01', 'roots02', 'ruins01', 'ruins02', 'ruins03', 'ruins04',
      'ruins05', 'ruins06', 'ruins07', 'ruins08', 'sailraft', 'scorpion', 'scythe', 'seastar', 'seaweed',
      'shark', 'sheep', 'shell', 'shelter01', 'shotgun', 'sign', 'skin', 'slime', 'slingshot', 'smallmeat',
      'smallmeatfried', 'snail', 'spade', 'spear', 'speedpotion', 'spider', 'stance', 'stone01', 'stone02',
      'stone03', 'stone04', 'stone05', 'stonestorage', 'storage', 'strandedguy', 'stump01', 'stump02', 'stump03',
      'sword', 'table', 'target', 'tent', 'tentitem', 'thatch', 'tooth', 'torch01', 'torch02', 'torchitem',
      'toxicrocket', 'trap', 'tree01', 'tree02', 'tree03', 'tree04', 'tree05', 'tree06', 'tree07', 'treehouse',
      'trunk', 'turtle', 'watch', 'water', 'waterpipe_empty', 'waterpipe_full', 'waterrock', 'waterrock0',
      'weedgrandpa', 'well', 'wilson', 'wine', 'wool', 'worm', 'wreck01', 'yacht'
    ];
    this.randomIcon = [];
    this.chooseRandomIcons();
  }

  ngOnInit() {
    interval(5000).subscribe(() => this.chooseRandomIcons());
  }

  chooseRandomIcons() {
    this.randomIcon[0] = this.icons[Math.floor(Math.random() * this.icons.length)];
    this.randomIcon[1] = this.icons[Math.floor(Math.random() * this.icons.length)];
    this.randomIcon[2] = this.icons[Math.floor(Math.random() * this.icons.length)];
  }

  playOnline() {
    this.startGame.emit();
  }

}
