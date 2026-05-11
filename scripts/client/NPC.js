class NPC extends Controller {
  die() {
    super.die();

    delete Controller.list[this.ID];
  }
}
