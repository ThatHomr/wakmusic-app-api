export class NaverResponseDto {
  resultcode: string;
  message: string;
  response: InnerResponse;
}

class InnerResponse {
  id: string;
  nickname: string;
  name: string;
}
