export namespace Ourhome {
  export interface CommonSupply {
    BUSIPLNM: string; // 제공업체명
    CORNERNM: string; // 코너명
    MENUNM: string; // 메뉴명
  }

  export interface CommonRequestBody {
    KEY: string; // 공통 API KEY
    GUBUN: string; // route 구분
    USER_ID: string // 회원 ID (Optional)
    BUSIPLCD: string // 스토어 ID
    DATE: string // YYYYMMDD 형식
    LANG: string // Default KOR
  }
}

export namespace Mealcare {
  export interface ServiceMenu {
    storeName: string;
    cornerName: string;
    mainMenu: string;
    subMenus: string[];
  }
}
