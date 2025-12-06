FROM public.ecr.aws/docker/library/node:24.11.1-alpine as builder
# stage1 시작. 이름은 builder
WORKDIR /app
COPY package*.json ./
# 라이브러리 설치 목록 파일만 복사
RUN npm install
# 라이브러리 설치
COPY . .
# 소스코드까지 복사.
RUN npm run build
#nodejs환경에서만 돌아가던 동적파일들이
#nginx같은 웹서버에서도 동작할 수 있는 정적인 파일로 변경되어 /dist에 저장됨.

##### 여기까지가 stage1 #####

FROM nginx:alpine
# stage2 시작

# Nginx 설정을 커스텀하기 위한 파일 복사 (선택 사항, 필요 시 추가)
COPY ./default.conf /etc/nginx/conf.d/default.conf

# 1단계에서 빌드된 정적 파일(dist 폴더 내용)을 Nginx의 기본 웹 루트로 복사
COPY --from=builder /app/dist /usr/share/nginx/html
