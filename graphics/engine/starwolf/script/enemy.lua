local Enemy = {}
Enemy.__index = Enemy

function Enemy:new(x, y)
    local o = setmetatable({}, Enemy)
    o.x = x
    o.y = y
    o.w = 50
    o.h = 50
    o.speed = 180
    return o
end

function Enemy:update(dt)
    self.y = self.y + self.speed * dt
end

function Enemy:draw()
    love.graphics.setColor(1,0,0)
    love.graphics.rectangle("fill", self.x, self.y, self.w, self.h)
    love.graphics.setColor(1,1,1)
end

return Enemy
