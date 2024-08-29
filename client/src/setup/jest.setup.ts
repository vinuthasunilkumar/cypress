module.exports = {
  setupFilesAfterEnv: ['./jest.setup'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': '../mocks/styleMock',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '../mocks/fileMock'
  }
}