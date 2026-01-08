local Player = {}
Player.__index = Player

function Player:new(x, y)
    local o = setmetatable({}, Player)
    o.x = x
    o.y = y
    o.w = 64
    o.h = 64
    o.scale = 1
    o.speed = 400
    o.hp = 3
    o.bullets = {}
    o.cooldown = 0
    o.maxX = love.graphics.getWidth() - (o.w * o.scale)
    return o
end

function Player:update(dt)
    if self.cooldown > 0 then
        self.cooldown = self.cooldown - dt
    end
    for i = #self.bullets, 1, -1 do
        local b = self.bullets[i]
        b.y = b.y - b.speed * dt
        if b.y < -20 then
            table.remove(self.bullets, i)
        end
    end
end

function Player:move(dir, dt)
    if dir == "left" then
        self.x = self.x - self.speed * dt
    elseif dir == "right" then
        self.x = self.x + self.speed * dt
    end
    if self.x < 0 then self.x = 0 end
    if self.x > self.maxX then self.x = self.maxX end
end

function Player:shoot()
    if self.cooldown <= 0 then
        table.insert(self.bullets, {
            x = self.x + (self.w * self.scale) / 2 - 4,
            y = self.y,
            w = 8,
            h = 16,
            speed = 800
        })
        self.cooldown = 0.25
    end
end

function Player:draw()
    love.graphics.setColor(1,1,0)
    love.graphics.rectangle("fill", self.x, self.y, self.w * self.scale, self.h * self.scale)
    for _,b in ipairs(self.bullets) do
        love.graphics.rectangle("fill", b.x, b.y, b.w, b.h)
    end
    love.graphics.setColor(1,1,1)
end

return Player
